const test = require('tape');
const patchi = require('../../src/patchi.js');

if (typeof Symbol === 'function') {
    test('Symbols are retained after change', (t) => {
        t.plan(4);

        const testSymbol = Symbol('test');

        const source = {
            a: 1,
            [testSymbol]: 2,
        };

        const output = patchi(source, {
            a: 2,
        });

        t.notEqual(source, output);
        t.notEqual(source.a, output.a);
        t.equal(output.a, 2);
        t.equal(output[testSymbol], 2);
    });

    test('Symbols values can be changed', (t) => {
        t.plan(3);

        const testSymbol = Symbol('test');

        const source = {
            a: 1,
            [testSymbol]: 2,
        };

        const output = patchi(source, {
            [testSymbol]: 3,
        });

        t.notEqual(source, output);
        t.equal(source.a, output.a);
        t.equal(output[testSymbol], 3);
    });

    test('Handle case where `Object.getOwnPropertySymbols` is not defined', (t) => {
        t.plan(3);

        const temp = Object.getOwnPropertySymbols;
        Object.getOwnPropertySymbols = void 0;

        const testSymbol = Symbol('test');

        const source = {
            a: 1,
            [testSymbol]: 2,
        };

        const output = patchi(source, {
            [testSymbol]: 3,
        });

        t.equal(source, output);
        t.equal(source.a, output.a);

        // Value didn't change
        // In reality, this isn't going to happen because Object.getOwnPropertySymbols was added at the same time as Symbol support
        t.equal(source[testSymbol], output[testSymbol]);

        Object.getOwnPropertySymbols = temp;
    });
}