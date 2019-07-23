const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Change object to array', (t) => {
    t.plan(5);

    const source = {
        a: {
            b: {
                c: 3,
            },
        },
        d: {},
    };

    const output = patchi(source, {
        a: {
            b: [
                3,
            ],
        },
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a.b, output.a.b);
    t.equal(source.d, output.d);
    t.deepEqual(output, {
        a: {
            b: [
                3,
            ],
        },
        d: {},
    });
});

test('Change array to object', (t) => {
    t.plan(5);

    const source = {
        a: {
            b: [
                3,
            ],
        },
        d: {},
    };

    const output = patchi(source, {
        a: {
            b: {
                c: 3,
            },
        },
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a.b, output.a.b);
    t.equal(source.d, output.d);
    t.deepEqual(output, {
        a: {
            b: {
                c: 3,
            },
        },
        d: {},
    });
});

test('Change value to empty object directly', (t) => {
    t.plan(5);

    const source = {
        a: {
            b: 2,
        },
        d: {},
    };

    const output = patchi(source, {
        a: {
            b: {},
        },
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a.b, output.a.b);
    t.equal(source.d, output.d);
    t.deepEqual(output, {
        a: {
            b: {},
        },
        d: {},
    });
});

test('Change value to empty array directly', (t) => {
    t.plan(5);

    const source = {
        a: {
            b: 2,
        },
        d: {},
    };

    const output = patchi(source, {
        a: {
            b: [],
        },
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a.b, output.a.b);
    t.equal(source.d, output.d);
    t.deepEqual(output, {
        a: {
            b: [],
        },
        d: {},
    });
});
