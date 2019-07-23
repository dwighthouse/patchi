# patchi

Original data and change data goes in, immutably applied patched data comes out. Maximizes saved references while minimizing iteration.


## Features

* **Fully Immutable** - The original value will never be modified.
* **References Maintained** - The minimum possible references will be changed when applying the changes.
* **Minimal Iteration** - Each object and array in the data tree is only visited once no matter how many changes are made.
* **Changes Stack** - Multiple changes to the same object or array happen in sequence at the same time, rather than modifying the entire object for each change.
* **Symbol Keys** - Handles Symbol in objects, if the environment supports them.
* **Key Deletion** - Available way of removing a key from an object, not just replacing it's value with undefined.
* **Root Primitive Support** - Passing root values that are not arrays or objects simply returns the new value.
* **100% Test Coverage**
* **No Dependencies** - Absolutely none.
* **642 Bytes Minzipped (ESM)** - 903 Bytes Minzipped (UMD)
* **Module Choice** - Available as both ESM and UMD format.
* **Wide Support** - Supports Chrome, Safari, Firefox, Edge, Node, and IE11. (Should work with IE9 and up, but those tests have not been run yet.)


## Install

```bash
> npm i --save patchi
```



## Usage

### Change an object
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
            c: 3,
        },
    },
});

// out = {a: {b: {c: 3, d: 2}}, e: { same: 1 }}
//       e's object reference (same) is identical
//       All other references differ
```



### Remove an object key entirely
```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: {
        b: 2,
    },
    e: {
        same: 1,
    },
};

var out = patchi(source, {
    a: {
        b: patchi.act.deleteKey,
    },
});

// out = {a: {}, e: { same: 1 }}
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
    a: patchi.act.createEmptyObject,
});

// out = {a: {}, e: { same: 1 }}
//       e's object reference (same) is identical
//       All other references differ
```



### Change an item in an array

_Note: Changes to an array can be nested. Multiple changes to a single array can occur in sequence, each change adding to the last._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.changeArrayItem,
            0,  // Index of change
            10, // New Value
        ],
    ],
});

// out = {a: [10, 2, 3, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Insert an item into an array

_Note: Items can be added at indices past the end of the existing array, creating empty array values between it and the former last item._

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.insertArrayItem,
            1,   // Index of injection location
            1.5, // Added Value
        ],
    ],
});

// out = {a: [1, 1.5, 2, 3, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Remove an item from an array
```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: [
        [
            patchi.act.removeArrayItem,
            2, // Index of removal location
        ],
    ],
});

// out = {a: [1, 2, { same: 1 }]}
//       'same' object's reference is identical
//       All other references differ
```



### Set value to new empty array

Because passing an empty array of change instructions will result in no changes, a special command must be used to set the value to a new, empty array. This will always create a new reference, even if the original value was an empty array.

```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: patchi.act.createEmptyArray,
});

// out = {a: []}
//       All references differ
```



### Changes that do not effect the final value do not change anything, leaving the references the same
```javascript
var patchi = require('patchi');
// or `import patchi from 'patchi';` with appropriate build system

var source = {
    a: 1,
    b: 2,
    c: [
        3,
    ]
};

var out = patchi(source, {
    a: 1,
    c: [
        [
            patchi.act.changeArrayItem,
            0,  // Index of change
            3, // New Value
        ],
    ]
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
