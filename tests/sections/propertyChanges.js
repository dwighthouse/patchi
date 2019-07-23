const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Add property', (t) => {
    t.plan(4);

    const source = {
        a: 1,
    };

    const output = patchi(source, {
        a: 1,
        b: 2,
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notOk(source.hasOwnProperty('b'));
    t.notEqual(source.b, output.b);
});

test('Remove property', (t) => {
    t.plan(4);

    const source = {
        a: 1,
        b: 2,
    };

    const output = patchi(source, {
        b: patchi.act.deleteKey,
    });

    t.notEqual(source, output);
    t.equal(source.a, output.a);
    t.notOk(output.hasOwnProperty('b'));
    t.deepEqual(output, {
        a: 1,
    });
});
