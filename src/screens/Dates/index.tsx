import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TapprHeader from '../../components/TapprHeader';
import { theme, commonStyles } from '../../styles/theme';

export default function DatesScreen() {
  return (
    <View style={styles.container}>
      <TapprHeader title="Dates" />
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>No dates scheduled</Text>
        <Text style={styles.emptySubtitle}>
          When someone chooses "Arrange a Date" from your card, you'll see it here!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.gray,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.lightGray,
    textAlign: 'center',
    lineHeight: 22,
  },
}); 