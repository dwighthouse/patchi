// require('../tests/sections/arrayChanges.js');
// require('../tests/sections/arrayMultipleChangeSequence.js');
// require('../tests/sections/arrayRoot.js');
// require('../tests/sections/deepSetValue.js');
// require('../tests/sections/objectMultipleChangeSequence.js');
// require('../tests/sections/objectSymbols.js');
// require('../tests/sections/propertyChanges.js');
// require('../tests/sections/rootValue.js');
// require('../tests/sections/setEmptyValues.js');
// require('../tests/sections/setTypeCrossover.js');
// require('../tests/sections/setValue.js');

const patchi = require('../src/patchi.js');

(() => {
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

console.log(out);
})();


(() => {
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

console.log(out);
})();




(() => {
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

console.log(out);
})();


(() => {
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

console.log(out);
})();


(() => {
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

console.log(out);
})();



(() => {
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
console.log(out);
})();


(() => {
var source = {
    a: [1, 2, 3, { same: 1 }],
};

var out = patchi(source, {
    a: patchi.act.createEmptyArray,
});

console.log(out);
})();