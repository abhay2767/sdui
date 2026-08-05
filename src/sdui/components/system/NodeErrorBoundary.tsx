import React from 'react';
import { logger } from '../../utils/logger';

interface Props {
  /** Node type being guarded — used for telemetry only. */
  nodeType: string;
  nodeId?: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Wraps every rendered node.
 *
 * Unknown *types* are handled by the registry, but a known component can still
 * throw on a malformed payload — a server sending `props.items: null` to a list
 * would otherwise take down the whole page. The boundary contains the blast
 * radius to the single section and reports it.
 */
export class NodeErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    logger.error(
      'NODE_CRASH',
      `Node "${this.props.nodeType}"${this.props.nodeId ? ` (${this.props.nodeId})` : ''} threw during render: ${error.message}`,
      { stack: error.stack },
    );
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
