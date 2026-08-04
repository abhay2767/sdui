import React, { useMemo } from 'react';
import { SDUINode } from '../types/schema';
import { getComponentForType } from '../registry';
import { useSDUI } from '../context/SDUIContext';

interface RendererProps {
  node?: SDUINode;
  nodes?: SDUINode[];
  navigation?: any;
}

export const SDUIRenderer: React.FC<RendererProps> = React.memo(({ node, nodes, navigation }) => {
  const { state, handleAction } = useSDUI();

  const renderSingleNode = (item: SDUINode, index: number | string): React.ReactNode => {
    if (!item || typeof item !== 'object') return null;

    // 1. Evaluate Condition (if specified)
    if (item.condition) {
      const { stateKey, equals, notEquals } = item.condition;
      const currentValue = state[stateKey];
      if (equals !== undefined && currentValue !== equals) return null;
      if (notEquals !== undefined && currentValue === notEquals) return null;
    }

    // 2. Resolve Component from Registry
    const Component = getComponentForType(item.type);

    // 3. Resolve Props (Inject State & Action handlers)
    const resolvedProps: Record<string, any> = { ...item.props };

    // Inject state bindings into props if specified
    if (resolvedProps.stateKey) {
      resolvedProps.selectedId = state[resolvedProps.stateKey] ?? resolvedProps.selectedId;
    }

    // Bind item actions to onPress or onSelect callback
    if (item.action) {
      resolvedProps.onPress = () => handleAction(item.action!, navigation);
    }

    if (item.type.toUpperCase() === 'CHIP_GROUP') {
      resolvedProps.onSelect = (chip: any) => {
        if (resolvedProps.stateKey) {
          handleAction(
            {
              type: 'UPDATE_STATE',
              payload: { key: resolvedProps.stateKey, value: chip.id },
            },
            navigation
          );
        }
        if (chip.action) {
          handleAction(chip.action, navigation);
        }
      };
    }

    // 4. Recursive Child Rendering
    let children: React.ReactNode = null;
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      children = item.children.map((childNode, childIdx) =>
        renderSingleNode(childNode, `${index}_child_${childIdx}`)
      );
    }

    const key = item.id || `node_${item.type}_${index}`;

    return (
      <Component
        key={key}
        {...resolvedProps}
        style={item.style ? { ...item.style } : undefined}
      >
        {children}
      </Component>
    );
  };

  if (nodes && Array.isArray(nodes)) {
    return <>{nodes.map((n, idx) => renderSingleNode(n, idx))}</>;
  }

  if (node) {
    return <>{renderSingleNode(node, 0)}</>;
  }

  return null;
});
