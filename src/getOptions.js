/**
 * Builds the options from the cli and package objects.
 *
 * @param {WorkflowDocker.Cli} cli
 * @param {WorkflowDocker.Package} packageJson
 * @return {WorkflowDocker.Options}
 */
export default function getOptions (cli, packageJson) {
    // Validate arguments
    const dockerConfig = packageJson && packageJson['wf-docker']
    let imageName = null
    let tags = null
    let run = []
    let description = ''

    if (cli.input.length === 0) {
        throw new Error('Missing arguments: <command>')
    }

    if (['push', 'build', 'build-push'].includes(cli.input[0]) === false) {
        throw new Error('Unknown command')
    }

    if (typeof dockerConfig === 'object' && dockerConfig !== null) {
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

    if (packageJson && typeof packageJson.description === 'string') {
        description = packageJson.description;
    }

    if (imageName === null) {
        if (cli.input.length === 1) {
            throw new Error('You need to provide image name. Use first cli argument or update your package.json - wf-build.image')
        }

        imageName = cli.input[1]
    }

    if (imageName === null) {
        if (cli.input.length === 2) {
            throw new Error('You need to provide image tags to create. Pass tags after image name in CLI or update your package.json - wf-build.tags (array)')
        }

        imageName = cli.input.splice(2)
    }

    const command = cli.input[0]

    // Support to build or push commands
    return {
        imageName: imageName,
        tags: tags,
        tasks: {
            build: command !== 'push',
            push: command !== 'build',
        },
        run: run,
        description: description
    }
}
