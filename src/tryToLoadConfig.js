import fs from 'fs'
import path from 'path'

function loadJson (configFile) {
    return JSON.parse(fs.readFileSync(
        configFile,
        'utf-8'
    ))
}

/**
 * Tries to load package json or config.
 *
 * @return {WorkflowDocker.Config|null}
 */
export default function tryToLoadConfig (isVerbose) {

    const configFile = path.join(process.cwd(), '.wf-docker.json')
    if (fs.existsSync(configFile) === true) {
        if (isVerbose === true) {
            console.warn('🐛 Using .wf-docker.json file')
            console.info(configFile)
        }

        return loadJson(configFile);
    }

    const file = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(file) === false) {
        return null
    }


    /**
     * @type {WorkflowDocker.Package}
     */
    let jsonPackage = loadJson(file);

    if (typeof jsonPackage["wf-docker"] === 'object') {
        const config = jsonPackage["wf-docker"];

        if (isVerbose === true) {
            console.warn('Using .wf-docker.json file')
            console.info(config)
        }

        // Use root package description if workflow description is not provided.
        if (jsonPackage
            && typeof jsonPackage.description === 'string'
            && typeof config.description !== 'string') {
            config.description = jsonPackage.description;
        }

        return config;
    } else {
        console.warn('🐛 Not using package.json file. Missing wf-docker object.')
    }

    return null;
}
