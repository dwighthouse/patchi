const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Push onto array does a push', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            3,
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.push, 4],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            1,
            2,
            3,
            4,
        ],
    })
});
