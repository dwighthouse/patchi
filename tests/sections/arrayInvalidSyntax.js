const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Invalid syntax: First item is change syntax, but not the rest', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            3,
        ],
    };

    try {
        const output = patchi(source, {
            a: [
                [patchi.act.change, 1, 2],
                3,
                4,
            ],
        });

        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Invalid syntax: First item is normal syntax, but not the rest, does not throw, but instead corrupts data', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            3,
        ],
    };

    const output = patchi(source, {
        a: [
            11,
            [patchi.act.change, 1, 12],
            [patchi.act.change, 1, 13],
        ],
    });

    t.deepEqual(output, {
        a: [
            11,
            [patchi.act.change, 1, 12],
            [patchi.act.change, 1, 13],
        ]
    })
});
