import fs from 'fs'
import fsExtra from 'fs-extra'
import execute from './execute.js'
import asyncForEach from './asyncForEach.js'
import runOnImage from './runOnImage.js'
import replaceTagsIn from './replaceTags.js'

/**
 *
 * @param {string|{tag: string, docker: object}} tagMeta
 * @param index
 * @param {WorkflowDocker.Build.Context} context
 * @return {Promise<void>}
 */
async function buildTag (tagMeta, index, context) {
    // Get tag
    const tagIsObject = typeof tagMeta !== 'string';
    let tag
    if (tagIsObject) {
        tag = tagMeta.tag
    } else {
        tag = tagMeta
    }

    const imageWithTag = `${context.options.imageName}:${tag}`
    console.log(`   𖤘 `.blue + imageWithTag)

    // Replace tags in template
    const replace = {
        '--DESCRIPTION--': context.cli.pkg.description,
        '--IMAGE_NAME--': context.options.imageName,
        '--TAG--': tag
    }

    // Support replacing docker template vars
    if (tagIsObject && typeof tagMeta.docker === 'object' && tagMeta.docker !== null) {
        Object.keys(tagMeta.docker).forEach((key) => {
            replace[`--${key}--`] = tagMeta.docker[key]
        })
    }

    // Ensure that dir exists
    const dockerDir = `./${tag}`
    if (fs.existsSync(dockerDir) === false) {
        fsExtra.mkdirSync(dockerDir)
    }

    // Create docker file
    const dockerFilePath = `${dockerDir}/Dockerfile`
    fs.writeFileSync(dockerFilePath, replaceTagsIn(replace, context.dockerFileTemplate))

    if (context.cli.flags.verbose) {
        console.log('       Docker file created at ' + dockerFilePath)
    }

    // Build the image
    if (context.options.tasks.build) {
        await execute(imageWithTag, tag, 'build', 'Building', '✓'.green, context.cli.flags)

        // Run commands now if verbose mode is not set
        if (false === context.cli.flags.verbose) {
            await runOnImage(imageWithTag, context.options.run)
        }
    }

    // Push the image
    if (context.options.tasks.push) {
        await execute(imageWithTag, tag, 'push', 'Pushing', '🚀', context.cli.flags)
    }

    // Generate  readme
    context.readmeTags += `**${imageWithTag}** | ` +
        `![](https://img.shields.io/microbadger/layers/${imageWithTag}?style=flat-square) ` +
        `![](https://img.shields.io/microbadger/image-size/${imageWithTag}?style=flat-square)\n`
}

/**
 * Generates the docker file and builds/pushes the image (if options.tasks allows it). Returns generated
 * readme tags
 *
 * @param {string} dockerFileTemplate Current docker file template
 * @param {WorkflowDocker.Options} options
 * @param {WorkflowDocker.Cli} cli
 * @return {Promise<string>}
 */
export default async function build (dockerFileTemplate, options, cli) {
    /**
     * @var {WorkflowDocker.Build.Context} context
     */
    const context = await asyncForEach(options.tags, buildTag, {
        dockerFileTemplate: dockerFileTemplate,
        readmeTags: '',
        options: options,
        cli: cli
    })

    // If we are using verbose mode, the log can be long, lets recap what tags where processed.
    if (cli.flags.verbose) {
        const tasks = []

        if (options.tasks.build) {
            tasks.push('built')
        }

        if (options.tasks.push) {
            tasks.push('pushed')
        }

        console.log('🐳 Docker files ' + tasks.join(' and '))
        await asyncForEach(options.tags, async (tag) => {
            const imageWithTag = `${options.imageName}:${tag}`
            console.log(`   𖤘 `.blue + imageWithTag)

            if (options.tasks.build) {
                await runOnImage(imageWithTag, options.run)
            }
        })
    }

    // Return generated readme tags
    return context.readmeTags
}


