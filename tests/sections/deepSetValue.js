const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Deep change normal value', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: 2,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {
                d: 3,
            },
        },
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notEqual(source.b, output.b);
    t.notEqual(source.b.c, output.b.c);
    t.notEqual(source.b.c.d, output.b.c.d);
    t.equal(source.b.e, output.b.e);
    t.equal(output.b.c.d, 3);
});

test('Deep change on earlier branch does not affect deeper branch', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: 2,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            e: 'test2',
        },
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notEqual(source.b, output.b);
    t.equal(source.b.c, output.b.c);
    t.equal(source.b.c.d, output.b.c.d);
    t.notEqual(source.b.e, output.b.e);
    t.equal(output.b.e, 'test2');
});

test('Deep non-change normal value', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: 2,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {
                d: 2,
            },
        },
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.b, output.b);
    t.equal(source.b.c, output.b.c);
    t.equal(source.b.c.d, output.b.c.d);
    t.equal(source.b.e, output.b.e);
    t.equal(output.b.c.d, 2);
});

test('Deep non-change NaN value is equal', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: NaN,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {
                d: NaN,
            },
        },
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.b, output.b);
    t.equal(source.b.c, output.b.c);
    t.ok(Object.is(source.b.c.d, output.b.c.d));
    t.equal(source.b.e, output.b.e);
    t.ok(Object.is(output.b.c.d, NaN));
});

test('Deep non-change -0 value is equal', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: -0,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {
                d: -0,
            },
        },
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.b, output.b);
    t.equal(source.b.c, output.b.c);
    t.ok(Object.is(source.b.c.d, output.b.c.d));
    t.equal(source.b.e, output.b.e);
    t.ok(Object.is(output.b.c.d, -0));
});

test('Deep change -0 value', (t) => {
    t.plan(7);

    const source = {
        a: 1,
        b: {
            c: {
                d: 0,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {
                d: -0,
            },
        },
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notEqual(source.b, output.b);
    t.notEqual(source.b.c, output.b.c);
    t.notOk(Object.is(source.b.c.d, output.b.c.d));
    t.equal(source.b.e, output.b.e);
    t.ok(Object.is(output.b.c.d, -0));
});

test('Deep non-change with empty object', (t) => {
    t.plan(8);

    const source = {
        a: 1,
        b: {
            c: {
                d: 2,
            },
            e: 'test',
        },
    };

    const output = patchi(source, {
        b: {
            c: {},
            e: 'test2',
        },
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notEqual(source.b, output.b);
    t.equal(source.b.c, output.b.c);
    t.equal(source.b.c.d, output.b.c.d);
    t.equal(output.b.c.d, 2);
    t.notEqual(source.b.e, output.b.e);
    t.equal(output.b.e, 'test2');
});