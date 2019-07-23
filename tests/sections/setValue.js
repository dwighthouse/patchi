const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Change normal value', (t) => {
    t.plan(3);

    const source = {
        a: 1,
    };

    const output = patchi(source, {
        a: 2,
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(output.a, 2);
});

test('Non-change normal value', (t) => {
    t.plan(2);

    const source = {
        a: 1,
    };

    const output = patchi(source, {
        a: 1,
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
});

test('Non-change NaN value is equal', (t) => {
    t.plan(2);

    const source = {
        a: NaN,
    };

    const output = patchi(source, {
        a: NaN,
    });

    t.equal(source, output);
    t.ok(Object.is(source.a, output.a));
});

test('Non-change -0 value is equal', (t) => {
    t.plan(2);

    const source = {
        a: -0,
    };

    const output = patchi(source, {
        a: -0,
    });

    t.equal(source, output);
    t.ok(Object.is(source.a, output.a));
});

test('Change -0 value', (t) => {
    t.plan(2);

    const source = {
        a: 0,
    };

    const output = patchi(source, {
        a: -0,
    });

    t.notEqual(source, output);
    t.notOk(Object.is(source.a, output.a));
});

test('Non-change with empty object', (t) => {
    t.plan(2);

    const source = {
        a: 0,
    };

    const output = patchi(source, {});

    t.equal(source, output);
    t.equal(source.a, output.a);
});
