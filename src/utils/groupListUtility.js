exports.groupBy = (items, key) => {
    return items.reduce((acc, item) => {
        if (!acc[item[key]]) {
            acc[item[key]] = [];
        }
        // Destructure to remove the key we're grouping by
        const { [key]: _, ...rest } = item;  // Remove the key dynamically
        // Push the rest of the item (excluding the key we're grouping by)
        acc[item[key]].push(rest);
        return acc;
    }, {});
};

exports.groupsByResolver = (items, keyList) => {
    // Base case: no more keys to process, just return the grouped items
    if (keyList.length === 0) {
        return items;
    }

    // Get the current key and the rest of the key list
    const currentKey = keyList[0];
    const remainingKeys = keyList.slice(1);

    // Group by the current key
    const grouped = this.groupBy(items, currentKey);

    // Recursively group each group by the next key in the list
    for (const [groupKey, groupItems] of Object.entries(grouped)) {
        grouped[groupKey] = this.groupsByResolver(groupItems, remainingKeys);
    }

    return grouped;
};

exports.groupsBy = (items, keyStrRoute) => {
    const keys = keyStrRoute.split(".");
    return this.groupsByResolver(items, keys);
};