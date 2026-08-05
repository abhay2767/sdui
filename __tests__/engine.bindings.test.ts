import { resolveValue, resolveString, resolveStyleTokens } from '../src/sdui/engine/bindings';

const scope = {
  state: { emiAmount: '18,450', selectedTenure: '36', nested: { deep: 7 } },
  item: { id: 'car_1', price: '₹11.45 Lakh' },
  event: { id: 'suv' },
};

describe('bindings', () => {
  it('interpolates inside strings', () => {
    expect(resolveString('₹{{state.emiAmount}}/mo', scope)).toBe('₹18,450/mo');
    expect(resolveString('{{state.selectedTenure}} months', scope)).toBe('36 months');
  });

  it('preserves type on whole-string bindings', () => {
    expect(resolveString('{{state.nested.deep}}', scope)).toBe(7);
    expect(resolveString('{{item}}', scope)).toBe(scope.item);
  });

  it('resolves item and event scopes', () => {
    expect(resolveString('{{item.price}}', scope)).toBe('₹11.45 Lakh');
    expect(resolveString('{{event.id}}', scope)).toBe('suv');
  });

  it('deep-resolves objects and arrays', () => {
    const props = {
      title: 'Tenure: {{state.selectedTenure}}',
      values: ['{{event.id}}', 'literal'],
      keep: 42,
    };
    expect(resolveValue(props, scope)).toEqual({
      title: 'Tenure: 36',
      values: ['suv', 'literal'],
      keep: 42,
    });
  });

  it('returns the same reference when nothing needs resolving (memo-friendly)', () => {
    const props = { title: 'plain', count: 3, nested: { a: 1 } };
    expect(resolveValue(props, scope)).toBe(props);
  });

  it('renders missing bindings as empty string, not "undefined"', () => {
    expect(resolveString('Hi {{state.nope}}!', scope)).toBe('Hi !');
  });

  it('resolves membership tests with the contains operator', () => {
    const listScope = {
      state: { wishlist: ['car_1', 'car_3'], city: 'Gurgaon NCR' },
    };
    expect(resolveString('{{state.wishlist contains car_1}}', listScope)).toBe(true);
    expect(resolveString('{{state.wishlist contains car_2}}', listScope)).toBe(false);
    // Strings test substring containment
    expect(resolveString('{{state.city contains NCR}}', listScope)).toBe(true);
    // Missing / non-container values resolve to false, never throw
    expect(resolveString('{{state.nope contains x}}', listScope)).toBe(false);
  });

  it('resolves theme tokens and drops unknown ones', () => {
    const theme = { color: { primary: '#FF6B00' } };
    expect(resolveStyleTokens({ backgroundColor: '$color.primary' }, theme)).toEqual({
      backgroundColor: '#FF6B00',
    });
    expect(resolveStyleTokens({ backgroundColor: '$color.missing', margin: 4 }, theme)).toEqual({
      margin: 4,
    });
  });
});
