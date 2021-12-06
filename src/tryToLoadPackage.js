import fs from 'fs'
import path from 'path'

/**
 * Tries to load package json
 * @return {Object|nul}
 */
export default function () {
    const file = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(file) === false) {
        return null
    }

    return JSON.parse(fs.readFileSync(
        file,
        'utf-8'
    ))
}
