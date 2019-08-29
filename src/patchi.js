const freeze = Object.freeze;

const act = freeze({
    delete: freeze({delete:1}),
    emptyObject: freeze({emptyObject:1}),
    change: freeze({change:1}), // [patchi.act.change, INDEX, VALUE] - for cases where only one or two items in the array changed, or to minimize changes when setting the whole array
    remove: freeze({remove:1}), // [patchi.act.remove, INDEX]
    push: freeze({push:1}),     // [patchi.act.push, VALUE]
    insert: freeze({insert:1}), // [patchi.act.insert, INDEX, VALUE]
});

const arrayActions = [act.change, act.remove, act.push, act.insert];

const isObject = (v) => {
    return Object.prototype.toString.call(v) === '[object Object]';
};

const areEqual = (x, y) => {
    if (x === y) {
        // Handle non-equality of -0 and 0
        return x !== 0 || 1 / x === 1 / y;
    }

    // Handle non-equality of NaN
    return x !== x && y !== y;
};

const getAllKeys = (obj) => {
    return Object.keys(obj).concat(Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(obj).filter((sym) => {
        return obj.propertyIsEnumerable(sym);
    }) : []);
};

const genNewValue = (oldValue, newValue) => {
    if (areEqual(oldValue, newValue)) {
        return oldValue;
    }

    if (newValue === act.delete) {
        return newValue;
    }

    if (newValue === act.emptyObject) {
        return {};
    }

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        return deepSetArray(oldValue, newValue);
    }

    if (isObject(oldValue) && isObject(newValue)) {
        return deepSetObject(oldValue, newValue);
    }

    return newValue;
};

const deepSetArray = (source, changes) => {
    // Presumes that if the first item isn't the array change syntax, the rest won't be either
    // If this is false, it is malformed array change syntax and will result in data corruption
    if (!Array.isArray(changes[0]) || arrayActions.indexOf(changes[0][0]) === -1) {
        const transformedArray = [];

        // Convert change array items into change syntax
        for (let i = 0; i < changes.length; i += 1) {
            transformedArray.push([act.change, i, changes[i]]);
        }

        // Change any remaining original array items into remove syntax
        for (let i = changes.length; i < source.length; i += 1) {
            transformedArray.push([act.remove, changes.length]);
        }

        changes = transformedArray;
    }

    let newArray = source;

    for (let c = 0; c < changes.length; c += 1) {
        const change = changes[c];

        if (!Array.isArray(change) || arrayActions.indexOf(change[0]) === -1) {
            throw new Error(`Malformed array change syntax`);
        }

        const type = change[0];

        const index = type === act.push ? newArray.length : parseInt(change[1], 10);

        if (index !== index || index < 0) {
            // Array length can never result in an invalid index, that's why we print change[1] instead of index here
            throw new Error(`Invalid array change index: ${change[1]}`);
        }

        let newValue = type === act.push ? change[1] : change[2];

        const oldValue = newArray[index];

        // changeArrayItem is only action at this point that could possibly avoid making changes, so check the value here
        if (type === act.change) {
            newValue = genNewValue(oldValue, newValue);

            // No change detected at any depth, do nothing
            if (oldValue === newValue) {
                continue;
            }
        }

        // First real change detected, make a copy of values
        if (newArray === source) {
            newArray = newArray.slice();
        }

        if (type === act.change) {
            newArray[index] = newValue;
        }
        else if (type === act.remove) {
            if (index >= newArray.length) {
                throw new Error('Invalid array removal index');
            }

            newArray.splice(index, 1);
        }
        else if (type === act.push) {
            newArray.push(newValue);
        }
        else if (index < newArray.length) {
            // type === act.insert
            // Insert into
            newArray.splice(index, 0, newValue);
        }
        else {
            // type === act.insert
            // Add at index beyond bounds of array
            newArray[index] = newValue;
        }
    }

    return newArray;
};

const deepSetObject = (source, changes) => {
    let newObject = source;

    const keys = getAllKeys(changes);

    for (let k = 0; k < keys.length; k += 1) {
        const key = keys[k];
        const oldValue = newObject[key];
        const newValue = genNewValue(oldValue, changes[key]);

        // No change, do nothing
        if (areEqual(oldValue, newValue)) {
            continue;
        }

        // First change detected, make a copy of values
        if (newObject === source) {
            newObject = Object.assign({}, newObject);
        }

        // Actually delete the key, don't just assign it to undefined
        if (newValue === act.delete) {
            delete newObject[key];
            continue;
        }

        // TODO: Consider handling property writability and configurability, which may affect whether or not to copy even if the value doesn't change
        // Non-enumerable items will always be skipped

        newObject[key] = newValue;
    }

    // TODO: Consider handling object freezing, sealing, and extensibility

    return newObject;
};

const patchi = (source, changes) => {
    return genNewValue(source, changes);
};

patchi.act = act;

module.exports = freeze(patchi);
