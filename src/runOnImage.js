import asyncForEach from './asyncForEach.js'
import {execa} from "execa"

/**
 * Runs given commands on the built image. Outputs the result (prepended by 2 tabs).
 *
 * @param {string} imageWithTag
 * @param {string[]}commands
 * @param {string} prependConsoleLog
 * @return {Promise<void>}
 */
export default async function runOnImage (imageWithTag, commands, prependConsoleLog = '        ') {
    await asyncForEach(commands, async (command) => {
        try {
            let args = ['run', imageWithTag].concat(command.split(' '))

            const {stdout} = await execa('docker', args)
            console.log(`${prependConsoleLog}${command}: ${stdout}`)
        } catch (e) {
            console.log(`${prependConsoleLog}${command}: failed`.blue)

            console.log(e.shortMessage.red)
            console.log(e.escapedCommand.gray)

            console.log(e.stdout.gray)
            console.log(e.stderr.red)

            process.exit(1)
        }
    })
}
