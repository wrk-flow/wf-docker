import fs from 'fs'
import path from 'path'
import replaceTagsIn from './replaceTags.js'
import readTemplateFile from './readTemplateFile.js'

export default function (options, cli, readmeTags, readmeFilePath) {
    const readmeTemplate = readTemplateFile(readmeFilePath)

    const baseBadges = [
        `![](https://img.shields.io/docker/pulls/${options.imageName}?style=flat-square)`,
        `![](https://img.shields.io/docker/stars/${options.imageName}?style=flat-square)`
    ].join(' ')

    // Replace tags in template
    const replace = {
        '--DESCRIPTION--': options.description,
        '--IMAGE_NAME--': options.imageName,
        '--TAGS--': `${baseBadges}\n\nImage | Badges\n --- | ---\n${readmeTags}`
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
