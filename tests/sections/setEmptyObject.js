const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Set to empty object', (t) => {
    t.plan(3);

    const source = {
        a: 1,
    };

    const output = patchi(source, {
        a: patchi.act.emptyObject,
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: {},
    });
});

test('Deep set to empty object', (t) => {
    t.plan(4);

    const source = {
        a: {
            b: {
                c: 1,
                d: 2,
            },
        },
        e: {
            f: 3,
        },
    };

    const output = patchi(source, {
        a: {
            b: patchi.act.emptyObject,
        },
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.e, output.e);
    t.deepEqual(output, {
        a: {
            b: {},
        },
        e: {
            f: 3,
        },
    });
});
