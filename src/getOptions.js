const usageDescription = ', config file or update your package.json'

/**
 * Builds the options from the cli and package objects.
 *
 * @param {WorkflowDocker.Cli} cli
 * @param {WorkflowDocker.Config|null} dockerConfig
 * @return {WorkflowDocker.Options}
 */
export default function getOptions (cli, dockerConfig) {
    // Validate arguments
    let imageName = null
    let tags = null
    let run = []
    let description = ''

    if (cli.input.length === 0) {
        throw new Error('Missing arguments: <command>')
    }

    if (['push', 'build', 'build-push', 'generate-readme'].includes(cli.input[0]) === false) {
        throw new Error('Unknown command')
    }

    if (typeof dockerConfig === 'object' && dockerConfig !== null) {
        description = dockerConfig.description || ''

        if (typeof dockerConfig.image === 'string') {
            imageName = dockerConfig.image
        }

        if (typeof dockerConfig.tags !== 'undefined'
            && dockerConfig.tags instanceof Array
            && dockerConfig.tags.length > 1) {
            tags = dockerConfig.tags
        }

        if (typeof dockerConfig.run !== 'undefined' && dockerConfig.run instanceof Array) {
            run = dockerConfig.run;
        }
    }

    if (imageName === null) {
        if (cli.input.length === 1) {

            throw new Error('You need to provide image name. Use first cli argument' + usageDescription + ' - wf-docker.image')
        }

        imageName = cli.input[1]
    }

    if (imageName === null) {
        if (cli.input.length === 2) {
            throw new Error('You need to provide image tags to create. Pass tags after image name in CLI' + usageDescription + ' - wf-docker.tags (array)')
        }

        imageName = cli.input.splice(2)
    }

    const command = cli.input[0];

    // Support to build or push commands
    const tasks = {
        build: command.includes('build'),
        push: command.includes('push'),
        generateReadme: true, // At this moment we are going to always generate readme
    };

    return {
        imageName: imageName,
        tags: tags,
        tasks: tasks,
        run: run,
        description: description
    }
}
