const freeze = Object.freeze;

const act = freeze({
    deleteKey: freeze({}),
    createEmptyObject: freeze({}),
    createEmptyArray: freeze({}),
    changeArrayItem: freeze({}),
    insertArrayItem: freeze({}),
    removeArrayItem: freeze({}),
});

const arrayActions = [act.changeArrayItem, act.insertArrayItem, act.removeArrayItem];

const isObject = (v) => {
    return v !== null && !Array.isArray(v) && typeof v === 'object';
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

    if (newValue === act.createEmptyObject) {
        return {};
    }

    if (newValue === act.createEmptyArray) {
        return [];
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
    let newArray = source;

    changes.forEach((change) => {
        if (
            // Non-array
            !Array.isArray(change) ||
            // Not the right action
            arrayActions.indexOf(change[0]) === -1 ||
            // Index not a number
            typeof change[1] !== 'number' ||
            // Index less than 0
            change[1] < 0 ||
            // For add or change, missing final value
            (change.length < 3 && change[0] !== act.removeArrayItem) ||
            // For change or remove, index beyond the bounds of array
            (change[1] >= source.length && change[0] !== act.insertArrayItem)
        ) {
            throw new Error('Malformed array modification syntax.');
        }

        const type = change[0];
        const index = change[1];

        const oldValue = source[index];
        let newValue = change[2];

        if (type === act.changeArrayItem) {
            newValue = genNewValue(oldValue, newValue);

            // No change detected at any depth, do nothing
            if (oldValue === newValue) {
                return;
            }
        }

        // First change detected, make a copy of values
        if (newArray === source) {
            newArray = source.slice();
        }

        if (type === act.changeArrayItem) {
            newArray[index] = newValue;
        }
        else if (type === act.insertArrayItem) {
            if (index < newArray.length) {
                // Insert into
                newArray.splice(index, 0, newValue);
            }
            else {
                // Add at index beyond bounds of array
                newArray[index] = newValue;
            }
        }
        else {
            newArray.splice(index, 1);
        }
    });

    return newArray;
};

const deepSetObject = (source, changes) => {
    let newObject = source;

    getAllKeys(changes).forEach((k) => {
        const oldValue = source[k];
        const newValue = genNewValue(oldValue, changes[k]);

        // Exact same value, do nothing
        if (areEqual(oldValue, newValue)) {
            return;
        }

        // First change detected, make a copy of values
        if (newObject === source) {
            newObject = Object.assign({}, source);
        }

        // Actually delete the key, don't just assign it to undefined
        if (newValue === act.deleteKey) {
            delete newObject[k];
            return;
        }

        // TODO: Consider handling property writability and configurability, which may affect whether or not to copy even if the value doesn't change
        // Non-enumerable items will always be skipped

        newObject[k] = newValue;
    });

    // TODO: Consider handling object freezing, sealing, and extensibility

    return newObject;
};

const patchi = (source, changes) => {
    return genNewValue(source, changes);
};

patchi.act = act;

module.exports = freeze(patchi);
