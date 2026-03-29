import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { API_BASE } from "../constants/api";

export default function AddProductScreen() {
  const params = useLocalSearchParams(); // ⭐ receives ?barcode=123

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [barcode, setBarcode] = useState("");
  const [threshold, setThreshold] = useState("");

  // ⭐ Auto-fill barcode when returning from scanner
  useEffect(() => {
    if (params.barcode) {
      setBarcode(params.barcode);
    }
  }, [params]);

  const validate = () => {
    if (!name.trim()) return Alert.alert("Error", "Product name is required");
    if (!qty.trim()) return Alert.alert("Error", "Quantity is required");
    if (!price.trim()) return Alert.alert("Error", "Price is required");
    if (!barcode.trim()) return Alert.alert("Error", "Barcode is required");
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          quantity: qty,
          price,
          expiry_at: expiry || null,
          barcode,
          low_stock_threshold: threshold || 5,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Product added successfully");
        setName("");
        setQty("");
        setPrice("");
        setExpiry("");
        setBarcode("");
        setThreshold("");
      } else {
        Alert.alert("Error", "Failed to add product");
      }
    } catch (err) {
      Alert.alert("Error", "Network error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      {/* Product Name */}
      <View style={styles.inputBox}>
        <Ionicons name="pricetag-outline" size={20} color="#777" />
        <TextInput
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      {/* Quantity */}
      <View style={styles.inputBox}>
        <Ionicons name="cube-outline" size={20} color="#777" />
        <TextInput
          placeholder="Quantity"
          value={qty}
          onChangeText={setQty}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Price */}
      <View style={styles.inputBox}>
        <Ionicons name="cash-outline" size={20} color="#777" />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="decimal-pad"
          style={styles.input}
        />
      </View>

      {/* Expiry Date */}
      <View style={styles.inputBox}>
        <Ionicons name="calendar-outline" size={20} color="#777" />
        <TextInput
          placeholder="Expiry Date (YYYY-MM-DD)"
          value={expiry}
          onChangeText={setExpiry}
          style={styles.input}
        />
      </View>

      {/* Barcode */}
      <View style={styles.inputBox}>
        <Ionicons name="barcode-outline" size={20} color="#777" />
        <TextInput
          placeholder="Barcode"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Scan Barcode Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/scan")}
      >
        <Ionicons name="scan-outline" size={22} color="white" />
        <Text style={styles.scanText}>Scan Barcode</Text>
      </TouchableOpacity>

      {/* Low Stock Threshold */}
      <View style={styles.inputBox}>
        <Ionicons name="alert-circle-outline" size={20} color="#777" />
        <TextInput
          placeholder="Low Stock Threshold (optional)"
          value={threshold}
          onChangeText={setThreshold}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      {/* Add Product Button */}
      <TouchableOpacity style={styles.addButton} onPress={submit}>
        <Text style={styles.addText}>Add Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
  scanText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },

  addButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
