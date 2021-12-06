#!/usr/bin/env node
'use strict';

import "colors"
import meow from "meow"
import getOptions from './src/getOptions.js'
import generateReadme from './src/generateReadme.js'
import build from './src/build.js'
import readTemplateFile from './src/readTemplateFile.js'
import tryToLoadPackage from './src/tryToLoadPackage.js'
import fs from "fs"

const usageDescription = `
Usage: 
    wf-docker build imageName tag1 tag2 ...
    wf-docker push imageName tag1 tag2 ...
    wf-docker build-push imageName tag1 tag2 ...
    wf-docker build --from-package-json
    
Options:
    --no-cache Do not use cache when building
    --help Print this help message
    --verbose, -v Prints docker build output
`

/**
 * @type {WorkflowDocker.Cli}
 */
const cli = meow(`
${usageDescription}
`, {
    importMeta: import.meta,
    flags: {
        'verbose': {
            type: 'boolean',
            alias: 'v'
        },
        noCache: {
            type: 'boolean',
            default: true
        }
    }
})

const DOCKERFILE_TEMPLATE = './Dockerfile.template'
const README_TEMPLATE = './readme.template.md'

async function start (options, cli) {
    console.log('🐳 Generating Docker files')

    const readmeTags = await build(readTemplateFile(DOCKERFILE_TEMPLATE), options, cli)

    if (fs.existsSync(README_TEMPLATE) === false) {
        console.log('📖 Not generating readme.md'.gray)
    } else {
        console.log('📖 Generating readme.md')
        generateReadme(options, cli, readmeTags, README_TEMPLATE)
    }
}

// Validate arguments
try {
    const options = getOptions(cli, tryToLoadPackage())

    // Start the logic
    start(options, cli).then(function () {
        console.log('🎆 Finished. Thank you for using work flows docker tool. More tools at https://wrk-flow.com'.green)
    }).catch(e => {
        console.log('')
        console.error(cli.flags.debug ? e.stack.red : e.message.red)
        process.exit(1)
    })

} catch (e) {
    console.error(cli.flags.debug ? e.stack.red : e.message.red)
    console.log(usageDescription.gray)
    process.exit(1)
}
