import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { API_BASE } from "../constants/api";
import useBanner from "@/components/Banner";

export default function AddProductScreen() {
  const params = useLocalSearchParams();
  const { Banner, showBanner } = useBanner();

  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [expiry, setExpiry] = useState("");
  const [barcode, setBarcode] = useState("");
  const [threshold, setThreshold] = useState("");
  const [showViewButton, setShowViewButton] = useState(false);

  const [allProducts, setAllProducts] = useState([]);

  // Load all products for duplicate detection
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => setAllProducts(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (params.barcode) {
      setBarcode(params.barcode);
    }
  }, [params]);

  const validate = () => {
    if (!name.trim()) return false;
    if (!qty.trim()) return false;
    if (!price.trim()) return false;
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    // ⭐ Duplicate barcode detection (only if barcode is filled)
    if (barcode.trim()) {
      const exists = allProducts.some(
        (p) => p.barcode && p.barcode.toString() === barcode.toString()
      );

      if (exists) {
        showBanner("Barcode already exists", "error");
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          quantity: qty,
          price,
          expiry_at: expiry || null,
          barcode: barcode || null, // optional barcode
          low_stock_threshold: threshold || 5,
        }),
      });

      if (res.ok) {
        showBanner("New product added!", "success");
        setShowViewButton(true);

        setName("");
        setQty("");
        setPrice("");
        setExpiry("");
        setBarcode("");
        setThreshold("");
      }
    } catch (err) {}
  };

  return (
    <>
      <Banner />

      <Stack.Screen
        options={{
          title: "Add Product",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Ionicons name="arrow-back" size={26} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add Product</Text>

        <View style={styles.inputBox}>
          <Ionicons name="pricetag-outline" size={20} color="#777" />
          <TextInput
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

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

        <View style={styles.inputBox}>
          <Ionicons name="calendar-outline" size={20} color="#777" />
          <TextInput
            placeholder="Expiry Date (YYYY-MM-DD)"
            value={expiry}
            onChangeText={setExpiry}
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="barcode-outline" size={20} color="#777" />
          <TextInput
            placeholder="Barcode (optional)"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => router.push("/scan")}>
            <Ionicons name="scan-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>

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

        <TouchableOpacity style={styles.addButton} onPress={submit}>
          <Text style={styles.addText}>Add Product</Text>
        </TouchableOpacity>

        {showViewButton && (
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push("/products")}
          >
            <Text style={styles.viewText}>View Added Product</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 25 },

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
  input: { marginLeft: 10, fontSize: 16, flex: 1 },

  addButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addText: { color: "white", fontSize: 18, fontWeight: "700" },

  viewButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  viewText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
