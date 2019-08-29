const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Change multiple items in a single array simultaneously', (t) => {
    t.plan(3);

    const source = [
        0,
        1.1,
        3.5,
        {},
    ];

    const output = patchi(source, [
        // No change
        [patchi.act.change, 0, 0],
        // Actual change
        [patchi.act.change, 1, 1],
        // Insert new item
        [patchi.act.insert, 2, 2],
        // Change old item at new position
        [patchi.act.change, 3, 3],
        // Remove original item
        [patchi.act.remove, 0],
        // Add new item at new position
        [patchi.act.insert, 3, 4],
        // Push to end
        [patchi.act.push, 5],
        // Add new item past end of array
        [patchi.act.insert, 8, 9],
        // Change already changed value
        [patchi.act.change, 0, 10],
    ]);

    const expectedOutput = [10, 2, 3, 4, {}, 5];
    expectedOutput[8] = 9;

    t.notEqual(source, output);
    t.equal(source[3], output[4]);
    t.deepEqual(output, expectedOutput);
});
