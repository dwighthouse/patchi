const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Change multiple keys in a single object simultaneously', (t) => {
    t.plan(3);

    const source = {
        a: 1,
        b: 1,
        c: 2,
        d: 4,
        obj: {},
    };

    const output = patchi(source, {
        a: 0, // Change
        b: 1, // No change
        d: patchi.act.delete,
    });

    const expectedOutput = [1, 2, 3, 4, {}];
    expectedOutput[8] = 9;

    t.notEqual(source, output);
    t.equal(source.obj, output.obj);
    t.deepEqual(output, {
        a: 0,
        b: 1,
        c: 2,
        obj: {},
    });
});
