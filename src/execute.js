import {execa} from "execa"

export default async function execute (imageWithTag, tag, command, title, finishedIcon, cliFlags) {
    const isVerbose = cliFlags.verbose

    try {
        const dockerArguments = command === 'build'
            ? ['build', `--tag=${imageWithTag}`, `--file=${tag}/Dockerfile`, '.', (cliFlags.noCache ? '--no-cache' : '')]
            : ['push', imageWithTag]

        const dockerProcess = execa(`docker`, dockerArguments)

        // TODO show only few lines
        if (isVerbose) {
            const dockerCommand = dockerProcess.spawnargs.join(' ')
            console.log(`     ${title}`.blue + ` ${dockerCommand}`.gray)
            dockerProcess.stdout.pipe(process.stdout);
            dockerProcess.stderr.pipe(process.stderr);
        } else {
            // Write without new line
            process.stdout.write(`     ${title} `)
        }
        await dockerProcess


        if (isVerbose) {
            console.log(`     ${title} ${finishedIcon}`.green)
        } else {
            // Append finished icon
            process.stdout.write(`${finishedIcon}\n`)
        }
    } catch (e) {
        // Force new line
        console.log('')
        console.log(e.shortMessage.red)
        console.log(e.escapedCommand.gray)

        // output the stdout before error line in non-verbose mode
        if (false === isVerbose) {
            console.log(e.stdout.gray)
            console.log(e.stderr.red)
        }

        console.log(`     ${title} 𖤘 ${imageWithTag} failed`.blue)
        process.exit(1)
    }
}
