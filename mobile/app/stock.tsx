import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { API_BASE } from "../constants/api";

export default function StockScreen() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/stock`)
      .then(res => res.json())
      .then(data => setStock(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Levels</Text>

      <FlatList
        data={stock}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.product_name}</Text>
            <Text>Stock: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600" },
});
