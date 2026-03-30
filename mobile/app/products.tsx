import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { API_BASE } from "../constants/api";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFiltered(data);

        const low = data.filter(
          (p) => p.quantity <= p.low_stock_threshold
        ).length;

        setLowStockCount(low);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  useEffect(() => {
    let list = products;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (search.trim() !== "") {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, category, products]);

  const renderItem = ({ item }) => {
    const lowStock = item.quantity <= item.low_stock_threshold;

    return (
      <TouchableOpacity
        style={[styles.row, lowStock && styles.lowRow]}
        onPress={() => router.push(`/product-details?id=${item.product_id}`)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name="cube-outline"
            size={22}
            color={lowStock ? "#d9534f" : "#444"}
          />
          <Text style={[styles.name, lowStock && styles.lowName]}>
            {item.name}
          </Text>
        </View>

        <View
          style={[
            styles.qtyBadge,
            { backgroundColor: lowStock ? "#d9534f" : "#4CAF50" },
          ]}
        >
          <Text style={styles.qtyText}>
            {item.quantity} {lowStock && "⚠️"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {lowStockCount > 0 && (
        <View style={styles.banner}>
          <Ionicons name="warning-outline" size={22} color="white" />
          <Text style={styles.bannerText}>
            {lowStockCount} product
            {lowStockCount > 1 ? "s" : ""} low on stock
          </Text>
        </View>
      )}

      <Text style={styles.title}>Products</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterRow}>
        {["all"].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterButton,
              category === cat && styles.filterButtonActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text
              style={[
                styles.filterText,
                category === cat && styles.filterTextActive,
              ]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#f8f8f8" },

  banner: {
    backgroundColor: "#d9534f",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  bannerText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },

  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },

  filterRow: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  filterTextActive: {
    color: "white",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  lowRow: {
    backgroundColor: "#ffe5e5",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  lowName: {
    color: "#d9534f",
    fontWeight: "700",
  },

  qtyBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  qtyText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
