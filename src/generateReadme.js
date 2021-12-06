import fs from 'fs'
import path from 'path'
import replaceTagsIn from'./replaceTags.js'
import readTemplateFile from './readTemplateFile.js'

export default function (options, cli, readmeTags, readmeFilePath) {
    const readmeTemplate = readTemplateFile(readmeFilePath)

    // Replace tags in template
    const replace = {
        '--DESCRIPTION--': cli.pkg.description,
        '--IMAGE_NAME--': options.imageName,
        '--TAGS--': `Image | Badges\n --- | ---\n${readmeTags}`
    }

    const templateFilePath = path.resolve(process.cwd(), './readme.md')
    // Write the template
    fs.writeFileSync(
        // Store the template at users location
        templateFilePath,
        // Replace the tags in the template
        replaceTagsIn(replace, readmeTemplate)
    )

    return templateFilePath
}
