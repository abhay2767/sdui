import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Linking } from 'react-native';
import type { ActionDefinition, BindingScope, SDUINode } from '../types/schema';
import { resolveValue } from '../engine/bindings';
import { logger } from '../utils/logger';
import { CommonActions } from '@react-navigation/native';
import { navigationRef, NAVIGABLE_SCREENS } from '../../navigation/navigationRef';

/**
 * Payload URLs must be https. `tel:`/`sms:`/`javascript:` and friends from a
 * compromised or typo'd payload reject-and-log instead of executing.
 */
const ALLOWED_URL_PATTERN = /^https:\/\//i;

export interface BottomSheetState {
  visible: boolean;
  title?: string;
  content?: string;
  /**
   * A sheet body can itself be an SDUI node tree, so the server can put a
   * tenure selector or a filter form in a sheet without any client work.
   */
  body?: SDUINode[];
}

type Dispatchable = ActionDefinition | ActionDefinition[];

interface SDUIContextValue {
  state: Record<string, unknown>;
  setStateValue: (key: string, value: unknown) => void;
  bottomSheet: BottomSheetState;
  closeBottomSheet: () => void;
  /** Executes one action, an array of actions, or a chain via `then`. */
  dispatch: (action: Dispatchable, scope: BindingScope) => void;
  /**
   * Seeds state from a page payload. `initialState` yields to existing keys
   * (a user's selection survives a payload refresh); `overrides` always wins
   * (fresh navigation params must replace the previous screen's).
   */
  hydrateState: (
    initialState?: Record<string, unknown>,
    overrides?: Record<string, unknown>,
  ) => void;
}

const SDUIContext = createContext<SDUIContextValue | undefined>(undefined);

/**
 * Holds runtime state and executes actions.
 *
 * There are deliberately no Cars24-specific defaults here — every key in
 * `state` originates from a payload's `initialState`. That is what lets the
 * same provider drive a screen it has never seen.
 */
export const SDUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Record<string, unknown>>({});
  const [bottomSheet, setBottomSheet] = useState<BottomSheetState>({ visible: false });

  /** Mirrors `state` so action chains read post-update values, not stale ones. */
  const stateRef = useRef(state);
  stateRef.current = state;

  const hydrateState = useCallback(
    (initialState?: Record<string, unknown>, overrides?: Record<string, unknown>) => {
      if (!initialState && !overrides) return;
      setState(previous => {
        const next = { ...(initialState ?? {}), ...previous, ...(overrides ?? {}) };
        stateRef.current = next;
        return next;
      });
    },
    [],
  );

  const setStateValue = useCallback((key: string, value: unknown) => {
    setState(previous => {
      const next = { ...previous, [key]: value };
      stateRef.current = next;
      return next;
    });
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheet({ visible: false });
  }, []);

  const runOne = useCallback(
    (action: ActionDefinition, scope: BindingScope) => {
      if (!action || typeof action.type !== 'string') return;

      // Resolve payload bindings against the freshest state, so chained
      // actions see what the previous step wrote.
      const liveScope: BindingScope = { ...scope, state: stateRef.current };
      const payload = (resolveValue(action.payload ?? {}, liveScope) ?? {}) as Record<
        string,
        unknown
      >;

      logger.info('ACTION', action.type, payload);

      switch (action.type) {
        case 'NAVIGATE': {
          const screen = payload.screen;
          if (typeof screen !== 'string' || !NAVIGABLE_SCREENS.has(screen)) {
            logger.warn('ACTION', `NAVIGATE rejected: "${String(screen)}" is not an allowed screen`, payload);
            break;
          }
          if (!navigationRef.isReady()) {
            logger.warn('ACTION', 'NAVIGATE ignored: navigator not ready', payload);
            break;
          }
          // The allowlist guarantees screen ∈ RootStackParamList. Dispatch a
          // CommonActions.navigate — the documented way to navigate with a
          // runtime-dynamic name through a typed ref.
          const params =
            payload.params && typeof payload.params === 'object'
              ? (payload.params as object)
              : undefined;
          navigationRef.dispatch(CommonActions.navigate(screen, params));
          break;
        }

        case 'NAVIGATE_BACK':
          if (navigationRef.isReady() && navigationRef.canGoBack()) {
            navigationRef.goBack();
          }
          break;

        case 'OPEN_BOTTOM_SHEET':
          setBottomSheet({
            visible: true,
            title: payload.title as string | undefined,
            content: payload.content as string | undefined,
            body: Array.isArray(payload.body) ? (payload.body as SDUINode[]) : undefined,
          });
          break;

        case 'CLOSE_BOTTOM_SHEET':
          setBottomSheet({ visible: false });
          break;

        case 'SET_STATE': {
          // Either a single {key, value} or a {values: {...}} batch.
          const values =
            payload.values && typeof payload.values === 'object'
              ? (payload.values as Record<string, unknown>)
              : typeof payload.key === 'string'
                ? { [payload.key]: payload.value }
                : null;
          if (!values) {
            logger.warn('ACTION', 'SET_STATE ignored: no key or values in payload', payload);
            break;
          }
          setState(previous => {
            const next = { ...previous, ...values };
            stateRef.current = next;
            return next;
          });
          break;
        }

        case 'TOGGLE_IN_LIST': {
          const key = payload.key as string | undefined;
          if (!key) break;
          setState(previous => {
            const current = previous[key];
            const list = Array.isArray(current) ? current : [];
            const value = payload.value;
            const next = {
              ...previous,
              [key]: list.includes(value)
                ? list.filter(entry => entry !== value)
                : [...list, value],
            };
            stateRef.current = next;
            return next;
          });
          break;
        }

        case 'OPEN_URL': {
          const url = payload.url;
          if (typeof url !== 'string' || !ALLOWED_URL_PATTERN.test(url)) {
            logger.warn('ACTION', `OPEN_URL rejected: non-https URL "${String(url)}"`, payload);
            break;
          }
          Linking.openURL(url).catch(error =>
            logger.error('ACTION', `OPEN_URL failed: ${String(error)}`),
          );
          break;
        }

        case 'API_CALL':
          // Mocked per the brief. A real implementation would hit the network
          // and feed the response back through SET_STATE.
          logger.info(
            'ACTION',
            `API_CALL (mocked) ${String(payload.method ?? 'GET')} ${String(payload.url ?? '')}`,
          );
          setBottomSheet({
            visible: true,
            title: (payload.title as string) ?? 'Request sent',
            content:
              (payload.content as string) ??
              `${String(payload.method ?? 'GET')} ${String(payload.url ?? '')} — mocked response 200 OK`,
          });
          break;

        case 'LOG':
          logger.info('ACTION_LOG', String(payload.message ?? ''), payload);
          break;

        default:
          // Forward-compatibility: an action type from a newer schema is
          // recorded and skipped, never thrown.
          logger.warn('ACTION', `Unsupported action type "${String(action.type)}" ignored`, payload);
      }

      if (Array.isArray(action.then)) {
        action.then.forEach(next => runOne(next, scope));
      }
    },
    [],
  );

  const dispatch = useCallback(
    (action: Dispatchable, scope: BindingScope) => {
      if (Array.isArray(action)) {
        action.forEach(entry => runOne(entry, scope));
      } else {
        runOne(action, scope);
      }
    },
    [runOne],
  );

  const value = useMemo<SDUIContextValue>(
    () => ({ state, setStateValue, bottomSheet, closeBottomSheet, dispatch, hydrateState }),
    [state, setStateValue, bottomSheet, closeBottomSheet, dispatch, hydrateState],
  );

  return <SDUIContext.Provider value={value}>{children}</SDUIContext.Provider>;
};

export const useSDUI = (): SDUIContextValue => {
  const context = useContext(SDUIContext);
  if (!context) throw new Error('useSDUI must be used within an SDUIProvider');
  return context;
};
