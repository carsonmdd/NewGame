import { useEffect } from "react";
import { router } from "expo-router";

export default function StartupScreen() {
  useEffect(() => {
    router.replace("/loading");
  }, []);

  return null;
}