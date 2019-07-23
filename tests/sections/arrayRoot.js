const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Root can be array', (t) => {
    t.plan(3);

    const source = [
        1,
        2,
        {},
    ];

    const output = patchi(source, [
        [patchi.act.changeArrayItem, 0, 'first'],
    ]);

    t.notEqual(source, output);
    t.equal(source[2], output[2]);
    t.deepEqual(output, [
        'first',
        2,
        {},
    ]);
});

test('Root array changes can be nested', (t) => {
    t.plan(4);

    const source = [
        [
            1,
            2,
        ],
        {},
    ];

    const output = patchi(source, [
        [patchi.act.changeArrayItem, 0, [
            [patchi.act.changeArrayItem, 1, 'middle'],
        ]],
    ]);

    t.notEqual(source, output);
    t.notEqual(source[0], output[0]);
    t.equal(source[1], output[1]);
    t.deepEqual(output, [
        [
            1,
            'middle',
        ],
        {},
    ]);
});