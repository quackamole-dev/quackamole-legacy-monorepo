// The place to put all helper methods that do not necessarily belong to a specific component
// Once this file gets too crowded, create an utils folder and start seperating the exported helper methods

/**
 * Transforms a javascript object into a query string.
 * @param object The source object. Example: {a: 5, b: 10}
 * @returns {string} The resulting query string. Example 'a=5&b=10'
 */
export const serializeQueryString = object => {
    return Object.entries(object).map(([key, value]) => `${key}=${value}`).join('&');
};
