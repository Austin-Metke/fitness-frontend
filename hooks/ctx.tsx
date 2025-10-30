// import { useContext, createContext, type PropsWithChildren, useEffect, useCallback, useMemo } from 'react';
// import { useStorageState } from './useStorageState';
// import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
// import { createUser, getUserByGoogleId } from '@/db/user';

// type GoogleUser = {
//   id: string;
//   name?: string | null;
//   givenName?: string | null;
//   familyName?: string | null;
//   email: string;
//   photo?: string | null;
// };

// const AuthContext = createContext<{
//   signIn: () => Promise<void>;
//   signOut: () => Promise<void>;
//   session?: string | null;
//   isLoading: boolean;
// }>({
//   signIn: async () => {},
//   signOut: async () => {},
//   session: null,
//   isLoading: false,
// });

// export function useSession() {
//   const value = useContext(AuthContext);
//   if (!value) {
//     throw new Error('useSession must be wrapped in a <SessionProvider />');
//   }
//   return value;
// }

// export function SessionProvider({ children }: PropsWithChildren) {
//   console.log("SessionProvider rendered");
//   const [[isLoading, session], setSession] = useStorageState('session');

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: "442605191795-15h3f17jnsr1tbp5sbhu80mpqdn98qq5.apps.googleusercontent.com",
//       offlineAccess: false,
//     });
//   }, []);

//   const signIn = useCallback(async () => {
//     const user = await googleSignIn();
//     if (!user) throw new Error('User not found');

//     const dbUser = await getUserByGoogleId(user.id);
//     console.log('dbUser', dbUser);

//     if (dbUser) {
//       setSession(dbUser.id?.toString() ?? null);
//       console.log("session set");
//     } else {
//       const newUser = await createUser({
//         g_id: user.id,
//         username: user.name || `${user.givenName ?? ''} ${user.familyName ?? ''}`.trim(),
//         email: user.email,
//         profile_pic: user.photo ?? null,
//       });
//       setSession(newUser.toString());
//     }
//   }, [setSession]);

//   const signOut = useCallback(async () => {
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       setSession(null);
//     } catch (error) {
//       console.error('An error occurred while signing out', error);
//     }
//   }, [setSession]);

//   const value = useMemo(() => ({
//     signIn,
//     signOut,
//     session,
//     isLoading,
//   }), [signIn, signOut, session, isLoading]);

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// const googleSignIn = async (): Promise<GoogleUser | null> => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const response = await GoogleSignin.signIn();

//     if (isSuccessResponse(response)) {
//       const user = response.data.user;
//       return {
//         id: user.id,
//         name: user.name,
//         givenName: user.givenName,
//         familyName: user.familyName,
//         email: user.email,
//         photo: user.photo,
//       };
//     } else {
//       console.error('Sign in was cancelled');
//       return null;
//     }
//   } catch (error) {
//     if (isErrorWithCode(error)) {
//       switch (error.code) {
//         case statusCodes.IN_PROGRESS:
//           console.error("Sign-in already in progress");
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           console.error("Play services are not available. Please install them.");
//           break;
//         default:
//           console.error("An error occurred while signing in");
//           break;
//       }
//     } else {
//       console.error("An unknown error occurred while signing in");
//     }
//     return null;
//   }
// };




import { useContext, createContext, type PropsWithChildren, useEffect } from 'react';
import { useStorageState } from './useStorageState';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { createUser, getUserByGoogleId } from '@/db/user';

type GoogleUser = {
  id: string;
  name?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  email: string;
  photo?: string | null;
};



const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  useEffect(() => {
    GoogleSignin.configure({
        webClientId: "442605191795-15h3f17jnsr1tbp5sbhu80mpqdn98qq5.apps.googleusercontent.com",
        offlineAccess: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async () => {
          // Call the google sign in method
          const user = await googleSignIn();
          if (!user) throw new Error('User not found');

          // Check if the db has the user
          const dbUser = await getUserByGoogleId(user.id);
          console.log('dbUser', dbUser)
          //console.log('dbUser.id', dbUser.id?.toString() ?? null)

          if (dbUser) {
            // Set the session to be the userID
            setSession(dbUser.id?.toString() ?? null);
            console.log("session set")
          } else {
            // Create the user
            const newUser = await createUser({
              g_id: user.id,
              username: user.name || user.givenName + ' ' + user.familyName,
              email: user.email,
              profile_pic: user.photo ?? null,
            });
            setSession(newUser.toString());
          }
        },
        signOut: async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setSession(null);
          } catch (error) {
            console.error('An error occurred while signing out', error);
          }
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

const googleSignIn = async(): Promise<GoogleUser | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
      const user = response.data.user;
      console.log("Google user:", user);
      return {
        id: user.id,
        name: user.name,
        givenName: user.givenName,
        familyName: user.familyName,
        email: user.email,
        photo: user.photo,
      };

    } else {
      console.error('Sign in was cancelled');
      return null;
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          console.error("Sign-in already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.error(
            "Play services are not available. Please install Play services from the Play Store."
          );
          break;
        default:
          console.error("An error occurred while signing in");
          break;
      }
    } else {
      console.error("An error occurred while signing in");
    }
    return null;
  }
}