/**
 * @callback OnForEachItem
 * @param item
 * @param {int} index
 * @param {Object} context
 * @param {Array} array
 */
/**
 *
 * @param {Array} array
 * @param {OnForEachItem} callback
 * @param {Object} context
 * @return {Promise<Object>}
 */
export default async function asyncForEach (array, callback, context = {}) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, context, array)
    }

    return context
}
