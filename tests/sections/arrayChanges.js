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
            [patchi.act.changeArrayItem, 0, 1],
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
            [patchi.act.changeArrayItem, 2, {
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
            [patchi.act.changeArrayItem, 0, 'first'],
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
            [patchi.act.changeArrayItem, 1, 'middle'],
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
            [patchi.act.changeArrayItem, 2, 'last'],
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
            [patchi.act.changeArrayItem, 2, {
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

test('Invalid format for array change causes throw: index beyond bounds of list', (t) => {
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
                [patchi.act.changeArrayItem, 3, 'after'],
            ],
        });
        t.ok(output === false);
    } catch (e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: negative index', (t) => {
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
                [patchi.act.changeArrayItem, -1, 'negative'],
            ],
        });
        t.ok(output === false);
    } catch (e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: no new value specified', (t) => {
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
                [patchi.act.changeArrayItem, 0],
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: empty', (t) => {
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
                [],
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: wrong act type', (t) => {
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
                [patchi.act.createEmptyObject, 1, {}],
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: non-number index', (t) => {
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
                [patchi.act.changeArrayItem, '1', 4],
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
});

test('Invalid format for array change causes throw: non-array content', (t) => {
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
                'lol',
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
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
            [patchi.act.insertArrayItem, 0, 'front'],
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
            [patchi.act.insertArrayItem, 1, 'middle'],
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
            [patchi.act.insertArrayItem, 3, 'end'],
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
            [patchi.act.insertArrayItem, 6, 'past end'],
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

test('Invalid format for array add causes throw: missing item to add', (t) => {
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
                [patchi.act.insertArrayItem, 0],
            ],
        });
        t.ok(output === false);
    } catch(e) {
        t.ok(true);
    }
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
                [patchi.act.insertArrayItem, -1, 'negative'],
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
            [patchi.act.removeArrayItem, 0],
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
            [patchi.act.removeArrayItem, 1],
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
            [patchi.act.removeArrayItem, 2],
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
                [patchi.act.removeArrayItem, 3],
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
                [patchi.act.removeArrayItem, -1],
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
            [patchi.act.changeArrayItem, 0, [
                [patchi.act.changeArrayItem, 1, 'middle'],
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
            [patchi.act.changeArrayItem, 0, [
                [patchi.act.changeArrayItem, 1, 2],
            ]],
        ],
    });

    t.equal(source, output);
    t.deepEqual(source, output);
});

test('Non-change with empty array', (t) => {
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
        a: [],
    });

    t.equal(source, output);
    t.equal(source.a, output.a);
});
