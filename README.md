# patchi

Original data and change data goes in, immutably applied patched data comes out. Maximizes saved references while minimizing iteration.



# Features

* **Fully Immutable** - The original value will never be modified.
* **References Maintained** - The minimum possible references will be changed when applying the changes.
* **Minimal Iteration** - Each object and array in the data tree is only visited once no matter how many changes are made.
* **Changes Stack** - Multiple changes to the same object or array happen in sequence, rather than modifying the entire object for each change.
* **Symbol Keys** - Handles Symbol in objects, if the environment supports them.
* **Key Deletion** - Available way of removing a key from an object, not just replacing it's value with undefined.
* **Root Primitive Support** - Passing root values that are not arrays or objects simply returns the new value.
* **100% Test Coverage**
* **No Dependencies** - Absolutely none.
* **765 Bytes Minzipped (ESM)** - 1025 Bytes Minzipped (UMD)
* **Module Choice** - Available as both ESM and UMD format.
* **Wide Support** - Supports Chrome, Safari, Firefox, Edge, Node, and IE11. (Should work with IE9 and up, but those tests have not been run yet.)



# Install

```bash
> npm i --save patchi
```



# Motivation

Similar in concept to [Immer](https://github.com/immerjs/immer), though different in execution. The difference is in how the updates are applied within an application. When specifying modifications to state deep in an application, the immutably changed copies have to be applied back up the chain, resulting in **extra iteration for every sub-branch that changes**. As a result, or by design, Immer is situated to expect change data to be handled only at the top level. Patchi, on the other hand, takes in a change set (a patch, if you will), which can be immutably applied up the chain resulting in a top-level patch object. This means that Patchi only needs to perform **extra iteration on the changes of each sub-branch that changes**.

If using the Redux style and only handling changes at the top level, this is a non-issue. For everything else, there's Patchi.



# Usage

## Changing Objects

The bulk of Patchi is focused on immutably modifying objects while maintaining maximum number of references. Arrays (below) have some special cases.

### Change an object key

Keys not specified will indicate that no change should occur to the value of that key. To specify that an entire object should not be modified, an empty object can be passed.

_Note: The reason why empty object is used to mean "no changes" rather than "create an empty object" is to allow for placeholders in other containers, like arrays, without changing their references or requiring duplication of contents._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: {
        b: {
            c: 4,
            d: 2,
        },
    },
    e: {
        same: 1,
    },
};

var out = patchi(source, {
    a: {
        b: {
            c: 3, // changed
        },
        f: 'new', // added
    },
});

// out = {a: {b: {c: 3, d: 2}}, f: 'new', e: { same: 1 }}
//       e's object reference (same) is identical
//       All other references differ
```



### Remove an object key entirely

A special value can be used to indicate the removal of the key itself, rather than simply assigning the key's value to undefined.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: {
        b: 2,
        c: 3,
    },
    e: {
        same: 1,
    },
};

var out = patchi(source, {
    a: {
        b: patchi.act.delete,
    },
});

// out = {a: { c: 3 }, e: { same: 1 }}
//       e's object reference (same) is identical
//       All other references differ
```



### Set value to new empty object

Because passing an empty object of change instructions will result in no changes, a special command must be used to set the value to a new, empty object. This will always create a new reference, even if the original value was an empty object.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: {
        b: {
            c: 4,
            d: 2,
        },
    },
    e: {
        same: 1,
    },
};

var out = patchi(source, {
    a: {
        b: patchi.act.emptyObject,
    },
});

// out = {a: { b: {} }, e: { same: 1 }}
//       e's object reference (same) is identical
//       All other references differ
```



## Changing Arrays

Arrays are a special case that contain implicit information about their contents in the form of the items' relative positions (indices). As a result, there are a couple of ways to modify arrays that help achieve different goals.

When you generally want to replace the entire contents of one array with another, the new version being the new source of truth, use the Normal Array Change Syntax. This will take the new array and generate a list of Managed Change Array Syntax operations that will first change any existing values to the new values, followed by the removal of any unnecessary items at the end, all while preserving references if possible.

When you only have one or two operations to perform on an array, use the Managed Change Array Syntax operations to perform exactly the expected operations and reduce iterations on your arrays.



### Change a whole array (Normal Array Change Syntax)

Replaces the old array with the new one while trying to maintain references by turning the new array into a sequence of Managed Change Array Syntax operations.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }, 5],
};

var out = patchi(source, {
    a: [2, 4, 6, { same: 1}],
});

// out = {a: [2, 4, 6, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Set value to new empty array (Normal Array Change Syntax)

Because passing an empty array causes the creation of a series of removal instructions, no special command is necessary to create a new array. This empty array will be a new reference if and only if the old array was not empty.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
    b: [],
    c: [4, 5],
};

var out = patchi(source, {
    a: [],
    b: [],
});

// out = {a: [], c: [4, 5]}
//       b and c's array references are identical
//       All references differ
```


### Change an individual item in an array (Managed Change Array Syntax)

Multiple changes to a single array can occur in sequence, each subsequent change applying to the previous changes, including multiple changes to the same index in a single operation.

_Note: Negative indices will throw._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.change,
            0,  // Index of change
            10, // New Value
        ],
        [
            patchi.act.change,
            1,  // Index of change
            20, // New Value
        ],
    ],
});

// out = {a: [10, 20, 3, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Insert an item into an array (Managed Change Array Syntax)

Multiple insertions into a single array can occur in sequence, each subsequent insertion applying to the previous changes, including potential changes to indices. To avoid confusion, consider applying insertions in reverse order.

_Note: Items can be added at indices past the end of the existing array, creating empty array values between it and the former last item. Negative indices will throw._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.insert,
            1,   // Index of insertion location
            1.5, // Added Value
        ],
        [
            patchi.act.insert,
            3,   // Index of insertion location, index affected by previous insertion
            2.5, // Added Value
        ],
    ],
});

// out = {a: [1, 1.5, 2, 2.5, 3, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Remove an item from an array (Managed Change Array Syntax)

Multiple removals from a single array can occur in sequence, each subsequent removal applying to the previous changes, including potential changes to indices. To avoid confusion, consider applying removals in reverse order.

_Note: Attempting to remove an item at an index that does not exist will throw._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, 4, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.remove,
            0, // Index of removal location
        ],
        [
            patchi.act.remove,
            2, // Index of removal location, index affected by previous removal
        ],
    ],
});

// out = {a: [2, 3, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Push an item into the end of an array (Managed Change Array Syntax)

As a helpful shortcut, the analog of Array.push is available as a Managed Change Array Syntax operation.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.push,
            4, // Added Value
        ],
        [
            patchi.act.push,
            5, // Added Value
        ],
    ],
});

// out = {a: [1, 2, 3, { same: 1 }, 4, 5]}
//       'same' object's reference is identical
//       All other references differ
```



## Reference preservation despite different types of changes

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    normalObjectChange: { a: 1, b: 2 },
    objectEmptyChange: { a: 1, b: 2 },
    normalArray: [1,2,3],
    managedArray: [1,2,3],
};

var out = patchi(source, {
    normalObjectChange: { b: 2 },
    normalObjectChange: {},
    normalArray: [1,2,3],
    managedArray: [
        [
            patchi.act.change,
            0, // Index of change
            1, // Same Value
        ],
    ],
});

// out === source
// Exactly equal, reference maintained
```




## Run Tests

### In Node

```bash
> npm run test
```

### In Browser

```bash
> npm run test-browser
```



## Build
```bash
> npm run build
```
