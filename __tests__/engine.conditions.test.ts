import { evaluateCondition, readPath } from '../src/sdui/engine/conditions';

describe('readPath', () => {
  it('reads nested paths and survives missing links', () => {
    const source = { a: { b: { c: 42 } } };
    expect(readPath(source, 'a.b.c')).toBe(42);
    expect(readPath(source, 'a.x.c')).toBeUndefined();
    expect(readPath(null, 'a')).toBeUndefined();
  });
});

describe('evaluateCondition', () => {
  const state = {
    selectedCategory: 'suv',
    count: 5,
    wishlist: ['car_1', 'car_3'],
    user: { city: 'Gurgaon' },
  };

  it('defaults to visible with no condition', () => {
    expect(evaluateCondition(undefined, state)).toBe(true);
  });

  it('handles equals / notEquals', () => {
    expect(evaluateCondition({ stateKey: 'selectedCategory', equals: 'suv' }, state)).toBe(true);
    expect(evaluateCondition({ stateKey: 'selectedCategory', equals: 'sedan' }, state)).toBe(false);
    expect(evaluateCondition({ stateKey: 'selectedCategory', notEquals: 'sedan' }, state)).toBe(true);
  });

  it('handles oneOf — the chip-filter pattern', () => {
    expect(
      evaluateCondition({ stateKey: 'selectedCategory', oneOf: ['all', 'suv'] }, state),
    ).toBe(true);
    expect(
      evaluateCondition({ stateKey: 'selectedCategory', oneOf: ['all', 'sedan'] }, state),
    ).toBe(false);
  });

  it('handles contains on arrays', () => {
    expect(evaluateCondition({ stateKey: 'wishlist', contains: 'car_1' }, state)).toBe(true);
    expect(evaluateCondition({ stateKey: 'wishlist', contains: 'car_9' }, state)).toBe(false);
  });

  it('handles exists and numeric comparisons', () => {
    expect(evaluateCondition({ stateKey: 'user.city', exists: true }, state)).toBe(true);
    expect(evaluateCondition({ stateKey: 'user.zip', exists: true }, state)).toBe(false);
    expect(evaluateCondition({ stateKey: 'count', gt: 3, lt: 10 }, state)).toBe(true);
    expect(evaluateCondition({ stateKey: 'count', gt: 5 }, state)).toBe(false);
  });

  it('handles composite all / any / not', () => {
    expect(
      evaluateCondition(
        {
          all: [
            { stateKey: 'selectedCategory', equals: 'suv' },
            { stateKey: 'count', gt: 1 },
          ],
        },
        state,
      ),
    ).toBe(true);
    expect(
      evaluateCondition(
        {
          any: [
            { stateKey: 'selectedCategory', equals: 'sedan' },
            { stateKey: 'count', gt: 1 },
          ],
        },
        state,
      ),
    ).toBe(true);
    expect(
      evaluateCondition({ not: { stateKey: 'selectedCategory', equals: 'suv' } }, state),
    ).toBe(false);
  });

  it('shows content on malformed conditions instead of blanking sections', () => {
    expect(evaluateCondition({} as never, state)).toBe(true);
    expect(evaluateCondition({ stateKey: 123 } as never, state)).toBe(true);
  });
});
