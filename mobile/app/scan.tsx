import { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";

export default function ScanScreen() {
  const params = useLocalSearchParams(); // ⭐ Detect where scan came from
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>Camera access is required</Text>
        <Button title="Allow Camera" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    setScanned(true);

    // ⭐ If scan came from Stock page
    if (params.from === "stock") {
      router.push(`/stock?barcode=${data}`);
      return;
    }

    // ⭐ Default → Add Product
    router.push(`/add-product?barcode=${data}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {scanned && (
        <View style={styles.scanAgainBox}>
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanAgainBox: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
