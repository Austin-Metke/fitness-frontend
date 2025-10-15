import React from 'react';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useSession } from '@/hooks/ctx';

export default function GoogleSignInButton() {
  const { signIn } = useSession();

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await signIn();
        } catch (error) {
          console.error('Error signing in:', error);
        }
      }}
    />
  );
}
