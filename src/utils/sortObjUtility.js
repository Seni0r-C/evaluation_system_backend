exports.sortObjectKeys = (obj, order = 'asc') => {
    // Get keys and sort them
    const sortedKeys = Object.keys(obj).sort((a, b) => {
        if (order === 'desc') {
            return b.localeCompare(a);  // Descending order
        }
        return a.localeCompare(b);     // Ascending order (default)
    });

    // Create a new object with sorted keys
    const sortedObj = {};
    sortedKeys.forEach((key) => {
        sortedObj[key] = obj[key];
    });

    return sortedObj;
};

exports.sortObjectEntries = (obj, order = 'asc') => {
    // Sort entries by keys
    const sortedEntries = Object.entries(obj).sort((a, b) => {
        if (order === 'desc') {
            return b[0].localeCompare(a[0]);  // Descending order
        }
        return a[0].localeCompare(b[0]);     // Ascending order (default)
    });
    
    // Convert the sorted entries back into an object
    return Object.fromEntries(sortedEntries);
};
