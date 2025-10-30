import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";

import FlexZoneHeader from "@/components/FlexZoneHeader";
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function AuthScreen() {
  const { signIn } = useSession();

  return (
    <ThemedView style={styles.container}>
      <FlexZoneHeader />
      <ThemedText type="title">Welcome to FlexZone!</ThemedText>

      <View style={styles.centered}>
        <GoogleSignInButton />   {/* Just render it */}
      </View>

      <ThemedText style={styles.footer}>Group 8 - CST438</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    fontSize: 16,
    color: "black", // Make sure it's visible
  },
});
