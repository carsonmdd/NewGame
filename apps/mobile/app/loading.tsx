import { useEffect } from "react";
import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(tabs)");
    }, 5000);

    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../assets/images/loading-bg.png")}
        resizeMode="cover"
        style={styles.bg}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>NewGame</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
  },
});