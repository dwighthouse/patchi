const test = require('tape');
const patchi = require('../../src/patchi.js');

//////////////////////////////////////////////////////////////////////////////////////////
// Level 1
//////////////////////////////////////////////////////////////////////////////////////////

test('Normal Array Modification Syntax: Level 1: Identical Data Causes No Changes', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            1,
            2,
            {},
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 1: Non-Identical Array Item Causes Changes', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            1,
            3,
            {},
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            3,
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 1: Non-Identical Sub-Array Item Causes Changes', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            1,
            2,
            { c: 2 },
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            { b: 1, c: 2 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 1: Shorter Change Array Causes Array Shortening', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {},
        ],
    };

    const output = patchi(source, {
        a: [
            1,
            2,
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[1], output.a[1]);
    t.deepEqual(output, {
        a: [
            1,
            2,
        ],
    });
});

test('Normal Array Modification Syntax: Level 1: Clear out array by passing empty array', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [],
    });
});

test('Normal Array Modification Syntax: Level 1: Assigning empty array to already empty array results in no change', (t) => {
    t.plan(3);

    const source = {
        a: [],
    };

    const output = patchi(source, {
        a: [],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.deepEqual(output, {
        a: [],
    });
});

test('Normal Array Modification Syntax: Level 1: Longer Change Array Causes Array Lengthening', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            1,
            2,
            {},
            3,
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            { b: 1 },
            3,
        ],
    });
});



//////////////////////////////////////////////////////////////////////////////////////////
// Level 2
//////////////////////////////////////////////////////////////////////////////////////////

test('Normal Array Modification Syntax: Level 2: Identical Data Causes No Changes', (t) => {
    t.plan(8);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2,{}],
            [{}],
            {},
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][2], output.a[0][2]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Non-Identical Array Item Causes Changes', (t) => {
    t.plan(8);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [100,2,{}],
            [{}],
            {},
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[0], output.a[0]);
    t.equal(source.a[0][2], output.a[0][2]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [100,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Non-Identical Sub-Array Item Causes Changes, Type 1', (t) => {
    t.plan(8);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2,{ b: 2 }],
            [{}],
            {},
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[0], output.a[0]);
    t.notEqual(source.a[0][2], output.a[0][2]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [1,2,{ b: 2 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Non-Identical Sub-Array Item Causes Changes, Type 2', (t) => {
    t.plan(8);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2,{}],
            [{ b: 2 }],
            {},
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][2], output.a[0][2]);
    t.notEqual(source.a[1], output.a[1]);
    t.notEqual(source.a[1][0], output.a[1][0]);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 2 }],
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Non-Identical Sub-Array Item Causes Changes, Type 3', (t) => {
    t.plan(8);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2,{}],
            [{}],
            { b: 2 },
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][2], output.a[0][2]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.notEqual(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 2 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Shorter Change Array Causes Array Shortening', (t) => {
    t.plan(4);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2],
            [{}],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[1], output.a[1]);
    t.deepEqual(output, {
        a: [
            [1,2],
            [{ b: 1 }],
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Clear out array by passing empty array', (t) => {
    t.plan(4);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [],
            [{}],
            {},
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[1], output.a[1]);
    t.deepEqual(output, {
        a: [
            [],
            [{ b: 1 }],
            { b: 1 },
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Assigning empty array to already empty array results in no change', (t) => {
    t.plan(4);

    const source = {
        a: [
            [],
        ],
    };

    const output = patchi(source, {
        a: [
            [],
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.deepEqual(output, {
        a: [
            [],
        ],
    });
});

test('Normal Array Modification Syntax: Level 2: Longer Change Array Causes Array Lengthening', (t) => {
    t.plan(4);

    const source = {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
        ],
    };

    const output = patchi(source, {
        a: [
            [1,2,{}],
            [{}],
            {},
            3,
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            [1,2,{ b: 1 }],
            [{ b: 1 }],
            { b: 1 },
            3,
        ],
    });
});



//////////////////////////////////////////////////////////////////////////////////////////
// Level 3
//////////////////////////////////////////////////////////////////////////////////////////

test('Normal Array Modification Syntax: Level 3: Identical Data Causes No Changes', (t) => {
    t.plan(11);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', {}],
                [{}],
                {},
            ],
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[1][0][1], output.a[1][0][1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.equal(source.a[1][1][0], output.a[1][1][0]);
    t.equal(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Non-Identical Array Item Causes Changes', (t) => {
    t.plan(11);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['b', {}],
                [{}],
                {},
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.notEqual(source.a[1], output.a[1]);
    t.notEqual(source.a[1][0], output.a[1][0]);
    t.equal(source.a[1][0][1], output.a[1][0][1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.equal(source.a[1][1][0], output.a[1][1][0]);
    t.equal(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['b', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Non-Identical Sub-Array Item Causes Changes, Type 1', (t) => {
    t.plan(11);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 2 }],
                [{}],
                {},
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.notEqual(source.a[1], output.a[1]);
    t.notEqual(source.a[1][0], output.a[1][0]);
    t.notEqual(source.a[1][0][1], output.a[1][0][1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.equal(source.a[1][1][0], output.a[1][1][0]);
    t.equal(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 2 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Non-Identical Sub-Array Item Causes Changes, Type 2', (t) => {
    t.plan(11);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', {}],
                [{ b: 2 }],
                {},
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.notEqual(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[1][0][1], output.a[1][0][1]);
    t.notEqual(source.a[1][1], output.a[1][1]);
    t.notEqual(source.a[1][1][0], output.a[1][1][0]);
    t.equal(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 2 }],
                { b: 1 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Non-Identical Sub-Array Item Causes Changes, Type 3', (t) => {
    t.plan(11);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', {}],
                [{}],
                { b: 2 },
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.notEqual(source.a[1], output.a[1]);
    t.equal(source.a[1][0], output.a[1][0]);
    t.equal(source.a[1][0][1], output.a[1][0][1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.equal(source.a[1][1][0], output.a[1][1][0]);
    t.notEqual(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 2 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Shorter Change Array Causes Array Shortening', (t) => {
    t.plan(5);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a'],
                [{}],
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[1], output.a[1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a'],
                [{ b: 1 }],
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Clear out array by passing empty array', (t) => {
    t.plan(5);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                [],
                [{}],
                {},
            ]
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[1], output.a[1]);
    t.equal(source.a[1][1], output.a[1][1]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                [],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Assigning empty array to already empty array results in no change', (t) => {
    t.plan(5);

    const source = {
        a: [
            [
                [],
                [1,2],
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [],
                [1,2],
            ],
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[0][0], output.a[0][0]);
    t.deepEqual(output, {
        a: [
            [
                [],
                [1,2],
            ],
        ],
    });
});

test('Normal Array Modification Syntax: Level 3: Longer Change Array Causes Array Lengthening', (t) => {
    t.plan(5);

    const source = {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
            ],
        ],
    };

    const output = patchi(source, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', {}],
                [{}],
                {},
                3,
            ],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[1], output.a[1]);
    t.equal(source.a[1][2], output.a[1][2]);
    t.deepEqual(output, {
        a: [
            [
                [1,2,3],
            ],
            [
                ['a', { b: 1 }],
                [{ b: 1 }],
                { b: 1 },
                3,
            ],
        ],
    });
});
