import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_BASE } from "../constants/api";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  type Product = {
    name: string;
    quantity: number;
    price: number;
    expiry_at?: string | null;
    barcode: string;
    low_stock_threshold: number;
  };
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>

      <View style={styles.infoBox}>
        <Ionicons name="cube-outline" size={22} color="#555" />
        <Text style={styles.infoText}>Quantity: {product.quantity}</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="cash-outline" size={22} color="#555" />
        <Text style={styles.infoText}>Price: ${product.price}</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="calendar-outline" size={22} color="#555" />
        <Text style={styles.infoText}>
          Expiry: {product.expiry_at?.slice(0, 10) || "N/A"}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="barcode-outline" size={22} color="#555" />
        <Text style={styles.infoText}>Barcode: {product.barcode}</Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="alert-circle-outline" size={22} color="#555" />
        <Text style={styles.infoText}>
          Low Stock Threshold: {product.low_stock_threshold}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
