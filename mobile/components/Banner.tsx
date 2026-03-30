import { Animated, StyleSheet, Text } from "react-native";
import { useRef, useState } from "react";

export default function useBanner() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const anim = useRef(new Animated.Value(-100)).current;

  const showBanner = (msg, bannerType = "success") => {
    setMessage(msg);
    setType(bannerType);

    Animated.timing(anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(anim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 2500);
  };

  const Banner = () => (
    <Animated.View
      style={[
        styles.banner,
        type === "error" ? styles.error : styles.success,
        { transform: [{ translateY: anim }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );

  return { Banner, showBanner };
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 14,
    zIndex: 999,
  },
  success: {
    backgroundColor: "#28a745",
  },
  error: {
    backgroundColor: "#ff3b30",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
