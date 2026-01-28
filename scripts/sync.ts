import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as p from '@clack/prompts'
import { skills, submodules } from '../meta'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function exec(cmd: string, cwd = root): string {
  return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function execSafe(cmd: string, cwd = root): string | null {
  try {
    return exec(cmd, cwd)
  }
  catch {
    return null
  }
}

function getGitSha(dir: string): string | null {
  return execSafe('git rev-parse HEAD', dir)
}

function submoduleExists(path: string): boolean {
  const gitmodules = join(root, '.gitmodules')
  if (!existsSync(gitmodules))
    return false
  const content = readFileSync(gitmodules, 'utf-8')
  return content.includes(`path = ${path}`)
}

interface Project {
  name: string
  url: string
  type: 'source' | 'vendor'
  path: string
}

async function initSubmodules() {
  const allProjects: Project[] = [
    ...Object.entries(submodules).map(([name, url]) => ({
      name,
      url,
      type: 'source' as const,
      path: `sources/${name}`,
    })),
    ...Object.entries(skills).map(([name, url]) => ({
      name,
      url,
      type: 'vendor' as const,
      path: `vendor/${name}`,
    })),
  ]

  const existingProjects = allProjects.filter(p => submoduleExists(p.path))
  const newProjects = allProjects.filter(p => !submoduleExists(p.path))

  if (newProjects.length === 0) {
    p.log.info('All submodules already initialized')
    return
  }

  const selected = await p.multiselect({
    message: 'Select projects to initialize',
    options: newProjects.map(project => ({
      value: project,
      label: `${project.name} (${project.type})`,
      hint: project.url,
    })),
    initialValues: newProjects,
  })

  if (p.isCancel(selected)) {
    p.cancel('Cancelled')
    return
  }

  const spinner = p.spinner()

  for (const project of selected as Project[]) {
    spinner.start(`Adding submodule: ${project.name}`)

    // Ensure parent directory exists
    const parentDir = join(root, dirname(project.path))
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true })
    }

    try {
      exec(`git submodule add ${project.url} ${project.path}`)
      spinner.stop(`Added: ${project.name}`)
    }
    catch (e) {
      spinner.stop(`Failed to add ${project.name}: ${e}`)
    }
  }

  p.log.success('Submodules initialized')

  if (existingProjects.length > 0) {
    p.log.info(`Already initialized: ${existingProjects.map(p => p.name).join(', ')}`)
  }
}

async function syncSubmodules() {
  const spinner = p.spinner()

  // Update all submodules
  spinner.start('Updating submodules...')
  try {
    exec('git submodule update --remote --merge')
    spinner.stop('Submodules updated')
  }
  catch (e) {
    spinner.stop(`Failed to update submodules: ${e}`)
    return
  }

  // Sync Type 2 skills
  const vendorProjects = Object.keys(skills)

  for (const name of vendorProjects) {
    const vendorPath = join(root, 'vendor', name)
    const vendorSkillsPath = join(vendorPath, 'skills')
    const outputPath = join(root, 'skills', name)

    if (!existsSync(vendorPath)) {
      p.log.warn(`Vendor submodule not found: ${name}. Run init first.`)
      continue
    }

    if (!existsSync(vendorSkillsPath)) {
      p.log.warn(`No skills directory in vendor/${name}/skills/`)
      continue
    }

    spinner.start(`Syncing skills: ${name}`)

    // Create output directory if it doesn't exist
    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true })
    }

    // Copy all files from vendor skills to output
    const files = readdirSync(vendorSkillsPath, { recursive: true, withFileTypes: true })
    for (const file of files) {
      if (file.isFile()) {
        const fullPath = join(file.parentPath, file.name)
        const relativePath = fullPath.replace(vendorSkillsPath, '')
        const destPath = join(outputPath, relativePath)

        // Ensure destination directory exists
        const destDir = dirname(destPath)
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true })
        }

        cpSync(fullPath, destPath)
      }
    }

    // Update GENERATION.md
    const sha = getGitSha(vendorPath)
    const generationPath = join(outputPath, 'GENERATION.md')
    const date = new Date().toISOString().split('T')[0]

    const generationContent = `# Generation Info

- **Source:** \`vendor/${name}\`
- **Git SHA:** \`${sha}\`
- **Synced:** ${date}
`

    writeFileSync(generationPath, generationContent)

    spinner.stop(`Synced: ${name}`)
  }

  p.log.success('All skills synced')
}

async function checkUpdates() {
  const spinner = p.spinner()
  spinner.start('Fetching remote changes...')

  try {
    exec('git submodule foreach git fetch')
    spinner.stop('Fetched remote changes')
  }
  catch (e) {
    spinner.stop(`Failed to fetch: ${e}`)
    return
  }

  const updates: { name: string, type: string, behind: number }[] = []

  // Check sources
  for (const name of Object.keys(submodules)) {
    const path = join(root, 'sources', name)
    if (!existsSync(path))
      continue

    const behind = execSafe('git rev-list HEAD..@{u} --count', path)
    if (behind && Number.parseInt(behind) > 0) {
      updates.push({ name, type: 'source', behind: Number.parseInt(behind) })
    }
  }

  // Check vendors
  for (const name of Object.keys(skills)) {
    const path = join(root, 'vendor', name)
    if (!existsSync(path))
      continue

    const behind = execSafe('git rev-list HEAD..@{u} --count', path)
    if (behind && Number.parseInt(behind) > 0) {
      updates.push({ name, type: 'vendor', behind: Number.parseInt(behind) })
    }
  }

  if (updates.length === 0) {
    p.log.success('All submodules are up to date')
  }
  else {
    p.log.info('Updates available:')
    for (const update of updates) {
      p.log.message(`  ${update.name} (${update.type}): ${update.behind} commits behind`)
    }
  }
}

async function main() {
  const [command] = process.argv.slice(2)

  // Handle subcommands directly
  if (command === 'init') {
    p.intro('Skills Manager - Init')
    await initSubmodules()
    p.outro('Done')
    return
  }

  if (command === 'sync') {
    p.intro('Skills Manager - Sync')
    await syncSubmodules()
    p.outro('Done')
    return
  }

  if (command === 'check') {
    p.intro('Skills Manager - Check')
    await checkUpdates()
    p.outro('Done')
    return
  }

  // No subcommand: show interactive menu
  p.intro('Skills Manager')

  const action = await p.select({
    message: 'What would you like to do?',
    options: [
      { value: 'sync', label: 'Sync submodules', hint: 'Pull latest and sync Type 2 skills' },
      { value: 'init', label: 'Init submodules', hint: 'Add new submodules' },
      { value: 'check', label: 'Check updates', hint: 'See available updates' },
    ],
  })

  if (p.isCancel(action)) {
    p.cancel('Cancelled')
    process.exit(0)
  }

  switch (action) {
    case 'init':
      await initSubmodules()
      break
    case 'sync':
      await syncSubmodules()
      break
    case 'check':
      await checkUpdates()
      break
  }

  p.outro('Done')
}

main().catch(console.error)
