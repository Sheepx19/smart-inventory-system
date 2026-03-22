import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function StockScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Stock</Text>
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
  text: {
    fontSize: 24,
    color: colors.brown,
  },
});
