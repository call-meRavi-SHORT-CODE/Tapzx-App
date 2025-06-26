"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

const { width, height } = Dimensions.get("window")

interface UserProfile {
  name: string
  username: string
  bio: string
  profileImage: string | null
  totalLinks: number
  totalViews: number
  totalClicks: number
}

interface QuickAction {
  id: string
  title: string
  icon: string
  color: string
  onPress: () => void
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "User Name",
    username: "user",
    bio: "Hello Connect with me ❤️",
    profileImage: null,
    totalLinks: 8,
    totalViews: 1247,
    totalClicks: 342,
  })

  const [activeTab, setActiveTab] = useState("Home")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const quickActions: QuickAction[] = [
    {
      id: "add-link",
      title: "Add Link",
      icon: "add",
      color: "#F59E0B",
      onPress: () => router.push("/(tabs)/AddLinks"),
    },
    {
      id: "qr-code",
      title: "QR Code",
      icon: "qr-code-outline",
      color: "#F59E0B",
      onPress: handleQRCode,
    },
  ]

  function handleQRCode() {
    Alert.alert("QR Code", "QR Code functionality will be implemented here", [{ text: "OK" }])
  }

  const handleShareProfile = () => {
    Alert.alert("Share Profile", "Profile sharing functionality will be implemented here", [{ text: "OK" }])
  }

  // NEW: Handle profile image press to navigate to landing page
  const handleProfileImagePress = () => {
    router.push("/(tabs)/ScanPage") // Changed from /(tabs)/ to /(ui)/
  }

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName)

    switch (tabName) {
      case "Connects":
        router.push("/(tabs)/ConnectsPage")
        break

      case "Scans": // Changed from "Scan" to "Scans" to match the tab name
        router.push("/(tabs)/ScanPage") // Changed from /(tabs)/ to /(ui)/
        break

      case "Shop":
        router.push("/(tabs)/ShopPage")
        break

      case "Insights":
              router.push("/(tabs)/SettingsPage") // ADD THIS LINE
              break
      

      default:
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoIcon}>
                  <Ionicons name="wifi" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.logoText}>Tapzx</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              {/* UPDATED: Made profile image clickable */}
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleProfileImagePress}
                activeOpacity={0.8}
              >
                {userProfile.profileImage ? (
                  <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.profileImagePlaceholder}>
                    <Image
                      source={{
                        uri: "https://t3.ftcdn.net/jpg/04/19/88/96/360_F_419889684_ZcIYZWwxtns7Q469DcLVybs94GIHNHjm.jpg",
                      }}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
                {/* Optional: Add a subtle overlay to indicate it's clickable */}
                <View style={styles.profileImageOverlay}>
                  <Ionicons name="eye-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
                </View>
              </TouchableOpacity>

              <Text style={styles.profileName}>{userProfile.name}</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="wifi" size={16} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>

              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionButton}
                    onPress={action.onPress}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={["#F59E0B", "#FBBF24"]} style={styles.quickActionGradient}>
                      <Ionicons name={action.icon as any} size={20} color="#0F172A" />
                      <Text style={styles.quickActionText}>{action.title}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Share Profile */}
            <TouchableOpacity style={styles.shareProfileButton} onPress={handleShareProfile} activeOpacity={0.8}>
              <View style={styles.shareProfileContent}>
                <Ionicons name="share-outline" size={18} color="#F59E0B" />
                <Text style={styles.shareProfileText}>Share Profile</Text>
              </View>
            </TouchableOpacity>

            {/* Profile URL */}
            <View style={styles.profileUrlContainer}>
              <Text style={styles.profileUrlLabel}>Your Profile URL:</Text>
              <Text style={styles.profileUrl}>tapzx.app/{userProfile.username}</Text>
            </View>
          </ScrollView>
          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            <View style={styles.navContainer}>
              {[
                { name: "Home", icon: "home", label: "Home" },
                { name: "Connects", icon: "people", label: "Connects" },
                {
                  name: "Scans",
                  icon: "scan-circle",
                  label: "Scans",
                  isProfile: true,
                  iconSet: "MaterialCommunityIcons",
                },
                { name: "Shop", icon: "storefront", label: "Shop" },
                { name: "Insights", icon: "settings", label: "Settings" },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.navItem, tab.isProfile && styles.navProfileItem]}
                  onPress={() => handleTabPress(tab.name)}
                  activeOpacity={0.7}
                >
                  {tab.isProfile ? (
                    <View style={styles.navProfileIcon}>
                      <Ionicons
                        name={tab.icon as any}
                        size={24}
                        color={activeTab === tab.name ? "#F59E0B" : "#64748B"}
                      />
                    </View>
                  ) : (
                    <Ionicons name={tab.icon as any} size={20} color={activeTab === tab.name ? "#F59E0B" : "#64748B"} />
                  )}
                  <Text style={[styles.navLabel, activeTab === tab.name && styles.navLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gradient: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  logoIcon: {
    marginRight: 8,
    transform: [{ rotate: "45deg" }], // Rotate 45 degrees
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 5,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 20,
    height: 16,
    justifyContent: "space-between",
  },
  menuLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
  },
  notificationButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  profileImageContainer: {
    marginBottom: 16,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#F59E0B",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#F59E0B",
  },
  // NEW: Overlay to indicate clickable profile image
  profileImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(245, 158, 11, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  profileBio: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F59E0B",
    marginLeft: 8,
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  shareProfileButton: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    marginBottom: 24,
  },
  shareProfileContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  shareProfileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 8,
  },
  profileUrlContainer: {
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 20,
  },
  profileUrlLabel: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 4,
  },
  profileUrl: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  bottomNavigation: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 10,
    borderRadius: 35,
  },
  navContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  navProfileItem: {
    transform: [{ scale: 1.1 }],
  },
  navProfileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#F59E0B",
  },
})
