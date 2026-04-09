import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL } from "../constants/api";

export default function HomeScreen() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [totalRes, lowRes] = await Promise.all([
        fetch(`${API_URL}/api/products/dashboard/total-products`),
        fetch(`${API_URL}/api/products/dashboard/low-stock`)
      ]);

      const totalData = await totalRes.json();
      const lowData = await lowRes.json();

      setTotalProducts(totalData.count);
      setLowStock(lowData.count);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.appTitle}>Stockly</Text>

      <Text style={styles.title}>Welcome to Stockly</Text>
      <Text style={styles.subtitle}>Manage your inventory with ease</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/products")}
      >
        <Ionicons name="list-outline" size={32} color="#28a745" />
        <Text style={styles.cardText}>View Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/add-product")}
      >
        <Ionicons name="add-circle-outline" size={32} color="#007AFF" />
        <Text style={styles.cardText}>Add Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/stock")}
      >
        <Ionicons name="swap-vertical-outline" size={32} color="#ff9500" />
        <Text style={styles.cardText}>Stock In / Stock Out</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Dashboard Overview</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <>
          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Total Products</Text>
            <Text style={styles.dashboardValue}>
              {totalProducts !== null ? totalProducts : "--"}
            </Text>
          </View>

          <View style={styles.dashboardCard}>
            <Text style={styles.dashboardLabel}>Low Stock Items</Text>
            <Text style={styles.dashboardValue}>
              {lowStock !== null ? lowStock : "--"}
            </Text>
          </View>
        </>
      )}
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

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 15,
  },

  dashboardCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  dashboardLabel: {
    fontSize: 16,
    color: "#555",
  },

  dashboardValue: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5,
  },
});
