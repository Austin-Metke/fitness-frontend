import { Redirect, router, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSession } from '@/hooks/ctx';
import { getProfile } from '@/db/profile';
//import { ProfilePic } from '@/components/ProfilePic';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  // Fix Hook order: always call hooks at the top
  useEffect(() => {
    if (!session) return; // skip effect if not logged in

    getProfile(session)
      .then((res) => {
        if (!res) {
          router.push('/onboarding'); // new user → onboarding
        }
        // No need to push if profile exists — already on Tabs
      })
      .catch(console.error);
  }, [session, router]);

  // Wait for session to load
  if (isLoading) {
    return null;
  }

  // Redirect to auth if user is not logged in
  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          //tabBarIcon: ({ color, size }) => <ProfilePic tab size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
