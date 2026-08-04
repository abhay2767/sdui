import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useSDUI } from '../context/SDUIContext';

export const BottomSheetComponent: React.FC = () => {
  const { bottomSheet, closeBottomSheet } = useSDUI();

  if (!bottomSheet.visible) return null;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={bottomSheet.visible}
      onRequestClose={closeBottomSheet}
    >
      <TouchableWithoutFeedback onPress={closeBottomSheet}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContent}>
              <View style={styles.dragHandle} />
              
              <Text style={styles.title}>{bottomSheet.title || 'Action Details'}</Text>
              
              <Text style={styles.bodyText}>
                {bottomSheet.content || 'Action executed successfully via Server Driven UI Engine.'}
              </Text>

              <TouchableOpacity style={styles.closeButton} onPress={closeBottomSheet}>
                <Text style={styles.closeButtonText}>Close Sheet</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 220,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
