import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Custom App Title */}
      <Text style={styles.appTitle}>Stockly</Text>

      <Text style={styles.title}>Welcome to Stockly</Text>
      <Text style={styles.subtitle}>Manage your inventory with ease</Text>

      {/* View Products */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/products")}
      >
        <Ionicons name="list-outline" size={32} color="#28a745" />
        <Text style={styles.cardText}>View Products</Text>
      </TouchableOpacity>

      {/* Add Product */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/add-product")}
      >
        <Ionicons name="add-circle-outline" size={32} color="#007AFF" />
        <Text style={styles.cardText}>Add Product</Text>
      </TouchableOpacity>

      {/* Stock In / Out */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/stock")}
      >
        <Ionicons name="swap-vertical-outline" size={32} color="#ff9500" />
        <Text style={styles.cardText}>Stock In / Stock Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f5f7fa",
  },

  appTitle: {
    fontSize: 34,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
