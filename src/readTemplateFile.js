import fs from 'fs'
import path from 'path'

/**
 * Loads the template file name within directory where the process was executed .
 * @param {string} fileName
 * @return {string}
 */
export default function readTemplateFile (fileName) {
    const filePath = path.join(process.cwd(), fileName)
    try {
        return fs.readFileSync(
            filePath,
            'utf-8'
        )
    } catch (e) {
        // Show custom message for no such file
        if (e.message.indexOf('ENOENT:') === -1) {
            throw e
        }

        throw new Error(`⛑  Template does not exists in your workspace: ${filePath}`)
    }
}
