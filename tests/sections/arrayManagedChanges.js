const test = require('tape');
const patchi = require('../../src/patchi.js');

test('Change array value with same value results in no change', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 0, 1],
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Change value below array with same value results in no change', (t) => {
    t.plan(5);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 2, {
                d: 4,
            }],
        ],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.equal(source.a[2].d, output.a[2].d);
    t.deepEqual(output, {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Change array value at start', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 0, 'first'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            'first',
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Change array value in middle', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 1, 'middle'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            1,
            'middle',
            {
                d: 4,
            },
        ],
    });
});

test('Change array value at end', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 2, 'last'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            1,
            2,
            'last',
        ],
    });
});

test('Change value below array causes change', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 2, {
                e: 5,
            }],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.notEqual(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            {
                d: 4,
                e: 5,
            },
        ],
    });
});

test('Change value after the end of the array just adds the value to that index', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 3, 'after'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.equal(output.a[3], 'after')
});

test('Negative index converts to string key on array object', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    try {
        const output = patchi(source, {
            a: [
                [patchi.act.change, -1, 'negative'],
            ],
        });

        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Not specifying the value sets the value to undefined', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 0],
        ],
    });
    t.ok(output.a[0] === void 0);
});

test('Assignment of normal data within array performs normal array assignment', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            'lol',
        ],
    });

    t.deepEqual(output, {
        a: [
            'lol',
        ],
    });
});

test('Adding item to start', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.insert, 0, 'front'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[3]);
    t.deepEqual(output, {
        a: [
            'front',
            1,
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Adding item to middle', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.insert, 1, 'middle'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[3]);
    t.deepEqual(output, {
        a: [
            1,
            'middle',
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Adding item to end', (t) => {
    t.plan(4);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.insert, 3, 'end'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[2], output.a[2]);
    t.deepEqual(output, {
        a: [
            1,
            2,
            {
                d: 4,
            },
            'end',
        ],
    });
});

test('Adding item past end', (t) => {
    t.plan(10);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.insert, 6, 'past end'],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[0], output.a[0]);
    t.equal(source.a[1], output.a[1]);
    t.equal(source.a[2], output.a[2]);
    t.equal(source.a[3], output.a[3]);
    t.equal(source.a[4], output.a[4]);
    t.equal(source.a[5], output.a[5]);
    t.notEqual(source.a[6], output.a[6]);
    t.equal('past end', output.a[6]);
});

test('Assigning insertion value that is empty inserts an undefined', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.insert, 0],
        ],
    });

    t.deepEqual(output, {
        a: [
            void 0,
            1,
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Invalid format for array add causes throw: negative index', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    try {
        const output = patchi(source, {
            a: [
                [patchi.act.insert, -1, 'negative'],
            ],
        });
        t.ok(output === false);
    } catch (e) {
        t.ok(true);
    }
});

test('Removing item from front', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.remove, 0],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            2,
            {
                d: 4,
            },
        ],
    });
});

test('Removing item from middle', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.remove, 1],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            1,
            {
                d: 4,
            },
        ],
    });
});

test('Removing item from end', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.remove, 2],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [
            1,
            2,
        ],
    });
});

test('Removing multiple items affects the index', (t) => {
    t.plan(3);

    const source = {
        a: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.remove, 0],
            [patchi.act.remove, 1],
            [patchi.act.remove, 4],
            [patchi.act.remove, 4],
            [patchi.act.remove, 2],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.deepEqual(output, {
        a: [2,4,6,9],
    });
});

test('Invalid format for array remove item causes throw: index beyond bounds of list', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    try {
        const output = patchi(source, {
            a: [
                [patchi.act.remove, 3],
            ],
        });
        t.ok(output === false);
    } catch (e) {
        t.ok(true);
    }
});

test('Invalid format for array remove item causes throw: negative index', (t) => {
    t.plan(1);

    const source = {
        a: [
            1,
            2,
            {
                d: 4,
            },
        ],
    };

    try {
        const output = patchi(source, {
            a: [
                [patchi.act.remove, -1],
            ],
        });
        t.ok(output === false);
    } catch (e) {
        t.ok(true);
    }
});

test('Array changes can be nested', (t) => {
    t.plan(4);

    const source = {
        a: [
            [
                1,
                2,
            ],
            {},
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 0, [
                [patchi.act.change, 1, 'middle'],
            ]],
        ],
    });

    t.notEqual(source, output);
    t.notEqual(source.a, output.a);
    t.equal(source.a[1], output.a[1]);
    t.deepEqual(output, {
        a: [
            [
                1,
                'middle',
            ],
            {},
        ],
    });
});

test('Array changes can be nested and can retain the same references if nothing actually changed', (t) => {
    t.plan(2);

    const source = {
        a: [
            [
                1,
                2,
            ],
            {},
        ],
    };

    const output = patchi(source, {
        a: [
            [patchi.act.change, 0, [
                [patchi.act.change, 1, 2],
            ]],
        ],
    });

    t.equal(source, output);
    t.deepEqual(source, output);
});
