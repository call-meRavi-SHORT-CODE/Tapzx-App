import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Check if user has completed profile setup
        if (user?.is_profile_complete) {
          router.replace('/(tabs)/HomePage');
        } else {
          // User needs to complete profile setup
          router.replace('/components/SignUp');
        }
      } else {
        router.replace('/components/SignIn');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  if (isLoading) {
    return (
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});