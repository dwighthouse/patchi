const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Root number', (t) => {
    t.plan(2);

    const source = 2;

    const output = patchi(source, 3);

    t.notEqual(source, output);
    t.equal(output, 3);
});
