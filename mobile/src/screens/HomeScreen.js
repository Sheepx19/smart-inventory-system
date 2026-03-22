import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stockly</Text>
      <Text style={styles.subtitle}>Mobile App Version</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.brown,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightBrown,
    marginTop: 8,
  },
});
