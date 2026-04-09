import { useEffect, useState } from "react";
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
import { API_URL } from "../constants/api";
import useBanner from "@/components/Banner";

type Product = {
  product_id: number;
  name: string;
  barcode?: string;
  quantity: number;
};

export default function StockScreen() {
  const params = useLocalSearchParams();
  const { Banner, showBanner } = useBanner();

  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [quantity, setQuantity] = useState("");
  const [mode, setMode] = useState("IN");

  // fetch all products once
  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  // when barcode is passed, auto-select the product
  useEffect(() => {
    if (params.barcode && products.length > 0) {
      const found = products.find((p) => p.barcode == params.barcode);
      if (found) {
        setProduct(found);
      }
    }
  }, [params, products]);

  const submit = async () => {
    if (!product) return;
    if (!quantity.trim()) return;

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) return;

    const endpoint =
      mode === "IN"
        ? `${API_URL}/api/products/stock-in`
        : `${API_URL}/api/products/stock-out`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.product_id,
          quantity: qty,
        }),
      });

      if (res.ok) {
        // calculate new quantity locally
        const updatedQty =
          mode === "IN"
            ? product.quantity + qty
            : product.quantity - qty;

        // update selected product so UI updates instantly
        if (product) {
          setProduct({
            ...product,
            quantity: updatedQty,
          });
        }

        // update products list so dropdown stays in sync
        setProducts((prev) =>
          prev.map((p) =>
            p.product_id === product.product_id
              ? { ...p, quantity: updatedQty }
              : p
          )
        );

        showBanner("Stock updated", "success");
        setQuantity("");
      }
    } catch (err) {}
  };

  return (
    <>
      <Banner />

      <Stack.Screen
        options={{
          title: "Stock In / Stock Out",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Ionicons name="arrow-back" size={26} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Stock In / Stock Out</Text>

        {/* Product dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Text style={styles.dropdownHeaderText}>
              {product ? product.name : "Select Product"}
            </Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 250 }}>
                {products.map((p) => (
                  <TouchableOpacity
                    key={p.product_id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setProduct(p);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Scan barcode */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push("/scan?from=stock")}
        >
          <Ionicons name="scan-outline" size={22} color="white" />
          <Text style={styles.scanText}>Scan Barcode</Text>
        </TouchableOpacity>

        {/* Selected product info */}
        {product && (
          <View style={styles.productBox}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDetail}>
              Current Stock: {product.quantity}
            </Text>
          </View>
        )}

        {/* Toggle IN/OUT */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, mode === "IN" && styles.activeToggle]}
            onPress={() => setMode("IN")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "IN" && styles.activeToggleText,
              ]}
            >
              Stock In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, mode === "OUT" && styles.activeToggle]}
            onPress={() => setMode("OUT")}
          >
            <Text
              style={[
                styles.toggleText,
                mode === "OUT" && styles.activeToggleText,
              ]}
            >
              Stock Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quantity input */}
        <View style={styles.inputBox}>
          <Ionicons name="cube-outline" size={22} color="#777" />
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity style={styles.submitButton} onPress={submit}>
          <Text style={styles.submitText}>
            {mode === "IN" ? "Add Stock" : "Remove Stock"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

  dropdownContainer: { marginBottom: 15 },
  dropdownHeader: {
    backgroundColor: "white",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownHeaderText: { fontSize: 16, fontWeight: "600", color: "#333" },

  dropdownList: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 6,
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  dropdownItemText: { fontSize: 16, color: "#333" },

  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
  scanText: { color: "white", fontSize: 16, marginLeft: 8, fontWeight: "600" },

  productBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  productName: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  productDetail: { fontSize: 16, color: "#555" },

  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: "#007AFF" },
  toggleText: { fontSize: 16, fontWeight: "600", color: "#555" },
  activeToggleText: { color: "white" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  input: { marginLeft: 10, fontSize: 16, flex: 1 },

  submitButton: {
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "white", fontSize: 18, fontWeight: "700" },
});
