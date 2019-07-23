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
        [patchi.act.changeArrayItem, 0, 0],
        // Actual change
        [patchi.act.changeArrayItem, 1, 1],
        // Insert new item
        [patchi.act.insertArrayItem, 2, 2],
        // Change old item at new position
        [patchi.act.changeArrayItem, 3, 3],
        // Remove original item
        [patchi.act.removeArrayItem, 0],
        // Add new item at new position
        [patchi.act.insertArrayItem, 3, 4],
        // Add new item past end of array
        [patchi.act.insertArrayItem, 8, 9],
    ]);

    const expectedOutput = [1, 2, 3, 4, {}];
    expectedOutput[8] = 9;

    t.notEqual(source, output);
    t.equal(source[3], output[4]);
    t.deepEqual(output, expectedOutput);
});
