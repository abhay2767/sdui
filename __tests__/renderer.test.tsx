/**
 * Renderer behavior tests — the guarantees the brief asks us to *show*:
 * unknown types degrade, crashing components are contained, conditions filter,
 * actions dispatch from JSON, data-driven repetition works, and hostile
 * payload targets are rejected.
 */
import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer, { ReactTestRenderer as TestInstance } from 'react-test-renderer';
import { SDUIRenderer, SDUIPageProvider } from '../src/sdui/renderer/Renderer';
import { SDUIProvider, useSDUI } from '../src/sdui/context/SDUIContext';
import { registerComponent } from '../src/sdui/registry';
import { navigationRef } from '../src/navigation/navigationRef';
import type { SDUINode } from '../src/sdui/types/schema';

function renderNodes(
  nodes: SDUINode[],
  options?: { initialState?: Record<string, unknown> },
): TestInstance {
  const Hydrator: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { hydrateState } = useSDUI();
    React.useLayoutEffect(() => {
      hydrateState(options?.initialState);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <>{children}</>;
  };

  let tree!: TestInstance;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <SDUIProvider>
        <Hydrator>
          <SDUIPageProvider>
            <SDUIRenderer nodes={nodes} />
          </SDUIPageProvider>
        </Hydrator>
      </SDUIProvider>,
    );
  });
  return tree;
}

function textContent(tree: TestInstance): string {
  return JSON.stringify(tree.toJSON());
}

/** Finds the touchable ancestor of the Text node with the given content. */
function pressByText(tree: TestInstance, label: string): void {
  const textNode = tree.root
    .findAllByType(Text)
    .find(node => node.props.children === label);
  expect(textNode).toBeTruthy();
  let touchable = textNode!.parent;
  while (touchable && typeof touchable.props.onPress !== 'function') {
    touchable = touchable.parent;
  }
  ReactTestRenderer.act(() => {
    touchable!.props.onPress();
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SDUIRenderer', () => {
  it('renders registered components from JSON', () => {
    const tree = renderNodes([
      { type: 'TEXT', props: { text: 'Hello SDUI' } },
    ]);
    expect(textContent(tree)).toContain('Hello SDUI');
  });

  it('degrades unknown component types without crashing', () => {
    const tree = renderNodes([
      { type: 'HOLOGRAM_WIDGET_9000', props: {} },
      { type: 'TEXT', props: { text: 'still alive' } },
    ]);
    const output = textContent(tree);
    expect(output).toContain('Section unavailable');
    expect(output).toContain('still alive');
  });

  it('renders the server-provided fallback node when supplied', () => {
    const tree = renderNodes([
      {
        type: 'UNKNOWN_THING',
        fallback: { type: 'TEXT', props: { text: 'fallback content' } },
      },
    ]);
    expect(textContent(tree)).toContain('fallback content');
  });

  it('version-gates nodes above the client schema version', () => {
    const tree = renderNodes([
      {
        type: 'TEXT',
        minVersion: '99.0',
        props: { text: 'future feature' },
        fallback: { type: 'TEXT', props: { text: 'gated fallback' } },
      },
    ]);
    const output = textContent(tree);
    expect(output).not.toContain('future feature');
    expect(output).toContain('gated fallback');
  });

  it('contains a component that throws during render', () => {
    const Exploder: React.FC = () => {
      throw new Error('boom');
    };
    registerComponent('EXPLODER', Exploder);

    // React logs the caught error; keep test output clean.
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const tree = renderNodes([
      { type: 'EXPLODER' },
      { type: 'TEXT', props: { text: 'page survived' } },
    ]);
    spy.mockRestore();

    const output = textContent(tree);
    expect(output).toContain('Section unavailable');
    expect(output).toContain('page survived');
  });

  it('filters nodes with visibleWhen against state', () => {
    const nodes: SDUINode[] = [
      {
        type: 'TEXT',
        visibleWhen: { stateKey: 'selectedCategory', oneOf: ['all', 'suv'] },
        props: { text: 'suv card' },
      },
      {
        type: 'TEXT',
        visibleWhen: { stateKey: 'selectedCategory', oneOf: ['all', 'sedan'] },
        props: { text: 'sedan card' },
      },
    ];
    const tree = renderNodes(nodes, { initialState: { selectedCategory: 'suv' } });
    const output = textContent(tree);
    expect(output).toContain('suv card');
    expect(output).not.toContain('sedan card');
  });

  it('resolves state bindings in props', () => {
    const tree = renderNodes(
      [{ type: 'TEXT', props: { text: '₹{{state.emiAmount}}/mo' } }],
      { initialState: { emiAmount: '18,450' } },
    );
    expect(textContent(tree)).toContain('₹18,450/mo');
  });

  it('dispatches NAVIGATE to allowed screens through the navigationRef', () => {
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(true);
    const dispatchSpy = jest
      .spyOn(navigationRef, 'dispatch')
      .mockImplementation(() => {});

    const tree = renderNodes([
      {
        type: 'BUTTON',
        props: { label: 'Go' },
        action: {
          type: 'NAVIGATE',
          payload: { screen: 'CarDetails', params: { car: { id: 'car_1' } } },
        },
      },
    ]);

    pressByText(tree, 'Go');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const action = dispatchSpy.mock.calls[0][0] as {
      payload?: { name?: string; params?: unknown };
    };
    expect(action.payload?.name).toBe('CarDetails');
    expect(action.payload?.params).toEqual({ car: { id: 'car_1' } });
  });

  it('rejects NAVIGATE to screens outside the allowlist', () => {
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(true);
    const dispatchSpy = jest
      .spyOn(navigationRef, 'dispatch')
      .mockImplementation(() => {});

    const tree = renderNodes([
      {
        type: 'BUTTON',
        props: { label: 'Evil' },
        action: { type: 'NAVIGATE', payload: { screen: 'AdminPanel' } },
      },
    ]);

    pressByText(tree, 'Evil');
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('runs SET_STATE from an action slot and re-renders bound props', () => {
    const nodes: SDUINode[] = [
      { type: 'TEXT', props: { text: 'tenure:{{state.tenure}}' } },
      {
        type: 'SEGMENTED_CONTROL',
        props: {
          selected: '{{state.tenure}}',
          segments: [
            { id: '24', label: '24 mo' },
            { id: '36', label: '36 mo' },
          ],
        },
        actions: {
          onSelect: { type: 'SET_STATE', payload: { key: 'tenure', value: '{{event.id}}' } },
        },
      },
    ];
    const tree = renderNodes(nodes, { initialState: { tenure: '36' } });
    expect(textContent(tree)).toContain('tenure:36');

    pressByText(tree, '24 mo');
    expect(textContent(tree)).toContain('tenure:24');
  });

  it('repeats a template over inline forEach data with {{item.*}} bindings', () => {
    const tree = renderNodes([
      {
        type: 'COLUMN',
        forEach: [
          { id: 'a', label: 'Alpha' },
          { id: 'b', label: 'Beta' },
        ],
        template: { type: 'TEXT', props: { text: '{{item.label}}!' } },
      },
    ]);
    const output = textContent(tree);
    expect(output).toContain('Alpha!');
    expect(output).toContain('Beta!');
  });

  it('repeats a template over a state array via forEachStateKey', () => {
    const tree = renderNodes(
      [
        {
          type: 'COLUMN',
          forEachStateKey: 'cities',
          template: { type: 'TEXT', props: { text: 'city:{{item.name}}' } },
        },
      ],
      {
        initialState: {
          cities: [{ id: 'ggn', name: 'Gurgaon' }, { id: 'blr', name: 'Bengaluru' }],
        },
      },
    );
    const output = textContent(tree);
    expect(output).toContain('city:Gurgaon');
    expect(output).toContain('city:Bengaluru');
  });

  it('wishlist heart: CAR_CARD contains-binding flips with TOGGLE_IN_LIST', () => {
    // The exact wiring the home payload uses on CAR_CARD nodes.
    const nodes: SDUINode[] = [
      {
        id: 'car_1',
        type: 'CAR_CARD',
        props: {
          title: 'Creta',
          price: '₹11.45 Lakh',
          isWishlisted: '{{state.wishlist contains car_1}}',
        },
        actions: {
          onWishlistPress: {
            type: 'TOGGLE_IN_LIST',
            payload: { key: 'wishlist', value: 'car_1' },
          },
        },
      },
    ];
    const tree = renderNodes(nodes, { initialState: { wishlist: [] } });
    expect(textContent(tree)).toContain('🤍');
    expect(textContent(tree)).not.toContain('❤️');

    pressByText(tree, '🤍');
    expect(textContent(tree)).toContain('❤️');

    pressByText(tree, '❤️');
    expect(textContent(tree)).toContain('🤍');
  });

  it('TOGGLE_IN_LIST adds and removes a value, reflected through bindings', () => {
    const nodes: SDUINode[] = [
      { type: 'TEXT', props: { text: 'wl={{state.wishlist}}' } },
      {
        type: 'BUTTON',
        props: { label: 'Wish' },
        action: { type: 'TOGGLE_IN_LIST', payload: { key: 'wishlist', value: 'car_1' } },
      },
    ];
    const tree = renderNodes(nodes, { initialState: { wishlist: [] } });
    expect(textContent(tree)).not.toContain('car_1');

    pressByText(tree, 'Wish');
    expect(textContent(tree)).toContain('car_1');

    pressByText(tree, 'Wish');
    expect(textContent(tree)).not.toContain('car_1');
  });

  it('evaluates all + any together in one composite condition', () => {
    const nodes: SDUINode[] = [
      {
        type: 'TEXT',
        visibleWhen: {
          all: [{ stateKey: 'a', equals: 1 }],
          any: [{ stateKey: 'b', equals: 2 }, { stateKey: 'c', equals: 3 }],
        },
        props: { text: 'both clauses hold' },
      },
      {
        type: 'TEXT',
        visibleWhen: {
          all: [{ stateKey: 'a', equals: 1 }],
          any: [{ stateKey: 'b', equals: 99 }],
        },
        props: { text: 'any clause fails' },
      },
    ];
    const tree = renderNodes(nodes, { initialState: { a: 1, b: 2, c: 0 } });
    const output = textContent(tree);
    expect(output).toContain('both clauses hold');
    expect(output).not.toContain('any clause fails');
  });
});
