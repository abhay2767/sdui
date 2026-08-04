import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ActionDefinition } from '../types/schema';
import { logger } from '../utils/logger';

interface BottomSheetState {
  visible: boolean;
  title?: string;
  content?: string;
}

interface SDUIContextType {
  state: Record<string, any>;
  updateState: (key: string, value: any) => void;
  toggleSelection: (key: string, itemId: string) => void;
  bottomSheet: BottomSheetState;
  openBottomSheet: (title?: string, content?: string) => void;
  closeBottomSheet: () => void;
  handleAction: (action: ActionDefinition, navigation?: any) => void;
  registerInitialState: (initialState?: Record<string, any>) => void;
}

const SDUIContext = createContext<SDUIContextType | undefined>(undefined);

export const SDUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Record<string, any>>({
    selectedCategory: 'all',
    selectedFilter: 'Popular',
    selectedCarId: null,
  });

  const [bottomSheet, setBottomSheet] = useState<BottomSheetState>({
    visible: false,
    title: '',
    content: '',
  });

  const registerInitialState = useCallback((initialState?: Record<string, any>) => {
    if (initialState) {
      setState(prev => ({ ...initialState, ...prev }));
    }
  }, []);

  const updateState = useCallback((key: string, value: any) => {
    logger.info('ACTION_UPDATE_STATE', `Updated state [${key}] = ${JSON.stringify(value)}`);
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSelection = useCallback((key: string, itemId: string) => {
    setState(prev => {
      const current = prev[key];
      let updated;
      if (Array.isArray(current)) {
        updated = current.includes(itemId)
          ? current.filter(id => id !== itemId)
          : [...current, itemId];
      } else {
        updated = current === itemId ? null : itemId;
      }
      logger.info('ACTION_TOGGLE_SELECTION', `Toggled [${key}] item: ${itemId}`);
      return { ...prev, [key]: updated };
    });
  }, []);

  const openBottomSheet = useCallback((title?: string, content?: string) => {
    logger.info('ACTION_BOTTOM_SHEET', `Opened bottom sheet: ${title}`);
    setBottomSheet({ visible: true, title, content });
  }, []);

  const closeBottomSheet = useCallback(() => {
    setBottomSheet({ visible: false });
  }, []);

  const handleAction = useCallback((action: ActionDefinition, navigation?: any) => {
    if (!action || !action.type) return;

    logger.info('ACTION_EXECUTE', `Action triggered: ${action.type}`, action.payload);

    switch (action.type) {
      case 'NAVIGATE':
        if (navigation && action.payload?.screen) {
          navigation.navigate(action.payload.screen, action.payload.params);
        } else {
          logger.warn('ACTION_NAVIGATE', 'Navigation object not passed or screen unspecified', action);
        }
        break;

      case 'OPEN_BOTTOM_SHEET':
        openBottomSheet(action.payload?.title, action.payload?.content);
        break;

      case 'UPDATE_STATE':
        if (action.payload?.key !== undefined) {
          updateState(action.payload.key, action.payload.value);
        }
        break;

      case 'TOGGLE_SELECTION':
        if (action.payload?.key && action.payload?.value) {
          toggleSelection(action.payload.key, action.payload.value);
        }
        break;

      case 'API_CALL':
        logger.info('ACTION_API_CALL', `Simulated API call to ${action.payload?.url || 'mock endpoint'}`);
        openBottomSheet('API Call Triggered', `Successfully called ${action.payload?.method || 'GET'} ${action.payload?.url || '/api/v1/cars'}`);
        break;

      default:
        logger.warn('ACTION_UNKNOWN', `Unknown action type: ${(action as any).type}`);
        break;
    }
  }, [openBottomSheet, updateState, toggleSelection]);

  return (
    <SDUIContext.Provider
      value={{
        state,
        updateState,
        toggleSelection,
        bottomSheet,
        openBottomSheet,
        closeBottomSheet,
        handleAction,
        registerInitialState,
      }}
    >
      {children}
    </SDUIContext.Provider>
  );
};

export const useSDUI = (): SDUIContextType => {
  const context = useContext(SDUIContext);
  if (!context) {
    throw new Error('useSDUI must be used within an SDUIProvider');
  }
  return context;
};
