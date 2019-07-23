# patchi

NOT READY FOR PRODUCTION USE

Method for deeply applying changes to an object or array using structured cloning with grouped iteration. Changes will be applied with the minimum possible changes to references.

* 100% Test Coverage
* Handles Symbol keys



## Usage

**Change an object**
```javascript
var patchi = require('patchi');

var source = {
    a: {
        b: {
            c: 4,
        },
    },
    d: {},
};

var output = patchi(source, {
    a: {
        b: {
            c: 2,
        },
    },
});

// Output: {a: {b: c: 2}}, d: {}}, where d's object reference is identical, but all others differ
```

**Change an item in an array**
```javascript
var patchi = require('patchi');

var source = {
    a: [1, 2, 3, {}],
};

var output = patchi(source, {
    a: [
        [
            patchi.act.changeArrayItem,
            0,  // Index of change
            10, // New Value
        ],
    ],
});

// Output: {a: [10, 2, 3, {}]}, where the final object's reference is identical, but the top level object and the a array differ
```

**Add an item to an array**
```javascript
var patchi = require('patchi');

var source = {
    a: [1, 2, 3, {}],
};

var output = patchi(source, {
    a: [
        [
            patchi.act.addArrayItem,
            1,   // Index of add
            1.5, // Added Value
        ],
    ],
});

// Output: {a: [1, 1.5, 2, 3, {}]}, where the final object's reference is identical, but the top level object and the a array differ
```
_Note: Items can be added past the end of the existing array._



## Run Tests

**In Node**

```bash
> npm run test
```

**In Browser**
```bash
> npm run test-browser
```



TODO: Handle case of multiple array changes in sequence, make sure it's applying to the new list, not the old.