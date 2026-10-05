import { Generator, getConfig } from '@tanstack/router-generator'

const root = process.cwd()
const config = getConfig({ routeTreeFileHeader: [] }, root)

await new Generator({ config, root }).run()
console.log(`routes: wrote ${config.generatedRouteTree}`)
