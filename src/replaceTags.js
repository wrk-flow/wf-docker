/**
 * Loops the replace object with key -> value and replace the tags in the template.
 *
 * @param {Object} replace
 * @param {string} template
 * @return {string}
 */
export default function replaceTagsIn (replace, template) {
    Object.keys(replace).forEach((key) => {
        const value = replace[key]
        template = template.replace(new RegExp(key, 'g'), value)
    })

    return template
}
