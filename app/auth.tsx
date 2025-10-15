import React from "react";
import { Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/hooks/ctx";
import { router } from "expo-router";
//import { function } from "@/hooks/ctx"

import FlexZoneHeader from "@/components/FlexZoneHeader";
import Auth from "@/components/Auth";
import GoogleSignInButton from '@/components/GoogleSignInButton';


export default function AuthScreen() {
  const { signIn } = useSession();

  
  const handleSignIn = async () => {
    await GoogleSignInButton();

    router.replace("/");
  };


  return (
    <ThemedView style={styles.container}>
      <FlexZoneHeader />
      <ThemedView>
          <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <GoogleSignInButton />
      </ThemedView>
        { <Button
          title="Sign In With Google"
          onPress={handleSignIn}
        /> }
      </ThemedView>
      <ThemedView>
        <ThemedText type="default">Group 8 - CST438</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
