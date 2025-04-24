exports.groupBy = (items, key, deleteKey=true, applyFunc=null) => {
    return items.reduce((acc, item) => {
        if (!acc[item[key]]) {
            acc[item[key]] = [];
        }
        if (deleteKey) {
            const { [key]: _, ...rest } = item;  // Remove the key dynamically
            // Push the rest of the item (excluding the key we're grouping by)
            acc[item[key]].push(applyFunc?applyFunc(rest):rest);
            return acc;
        }
        acc[item[key]].push(applyFunc?applyFunc(item):item);
        // If applyFunc is provided, apply it to the item before pushing
        // Destructure to remove the key we're grouping by
        return acc;
    }, {});
};

exports.groupsByResolver = (items, keyList, deleteKey=true, applyFunc=null) => {
    // Base case: no more keys to process, just return the grouped items
    if (keyList.length === 0) {
        return items;
    }

    // Get the current key and the rest of the key list
    const currentKey = keyList[0];
    const remainingKeys = keyList.slice(1);

    // Group by the current key
    const grouped = keyList.length === 1?this.groupBy(items, currentKey, deleteKey, applyFunc): this.groupBy(items, currentKey, deleteKey, applyFunc);

    // Recursively group each group by the next key in the list
    for (const [groupKey, groupItems] of Object.entries(grouped)) {
        grouped[groupKey] = this.groupsByResolver(groupItems, remainingKeys);
    }

    return grouped;
};

exports.groupsBy = (items, keyStrRoute, deleteKey=true, applyFunc=null) => {
    const keys = keyStrRoute.split(".");
    return this.groupsByResolver(items, keys, deleteKey, applyFunc);
};