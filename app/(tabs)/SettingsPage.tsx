"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Alert,
  Switch,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

interface SettingItem {
  id: string
  title: string
  subtitle?: string
  icon: string
  iconType: "Ionicons" | "MaterialCommunityIcons"
  type: "navigation" | "toggle" | "action"
  value?: boolean
  onPress?: () => void
  color?: string
  showBadge?: boolean
  badgeText?: string
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Insights")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))

  // Settings states
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [hapticFeedback, setHapticFeedback] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)

  // Animation refs
  const cardAnims = useRef([...Array(10)].map(() => new Animated.Value(0))).current
  const floatingAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    startAnimations()
    startContinuousAnimations()
  }, [])

  const startAnimations = (): void => {
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

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start()
    })
  }

  const startContinuousAnimations = (): void => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const handleSignOut = (): void => {
    Alert.alert(
      "Sign Out 👋",
      "Are you sure you want to sign out? You'll need to sign in again to access your account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // Clear any stored data here
            Alert.alert("Signed Out Successfully! ✅", "You have been signed out.", [
              {
                text: "OK",
                onPress: () => router.push("/(tabs)/HomePage"),
              },
            ])
          },
        },
      ],
    )
  }

  const handleHowToTap = (): void => {
    Alert.alert(
      "How to Use Tapzx 📱",
      "• Tap your NFC card on any phone\n• Share your profile instantly\n• Scan others' cards to connect\n• Manage all connections in one place\n• Export your data anytime",
      [{ text: "Got it!" }],
    )
  }

  const handleInsights = (): void => {
    router.push("/(ui)/InsightsPage")
  }

  const handleTabPress = (tabName: string): void => {
    setActiveTab(tabName)

    switch (tabName) {
      case "Home":
        router.push("/(tabs)/HomePage")
        break

      case "Connects":
        router.push("/(tabs)/ConnectsPage")
        break

      case "Scans":
        router.push("/(tabs)/ScanPage")
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

  const settingsData: SettingItem[] = [
    // Account Section
    {
      id: "profile",
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: "person-outline",
      iconType: "Ionicons",
      type: "navigation",
      onPress: () => router.push("/(tabs)/EditProfile"),
      color: "#3B82F6",
    },
    {
      id: "premium",
      title: "Upgrade to Premium",
      subtitle: "Unlock unlimited features",
      icon: "crown",
      iconType: "MaterialCommunityIcons",
      type: "navigation",
      onPress: () => router.push("/(ui)/PremiumPage"),
      color: "#F59E0B",
      showBadge: true,
      badgeText: "PRO",
    },

    // App Settings
    {
      id: "notifications",
      title: "Push Notifications",
      subtitle: "Get notified about new connections",
      icon: "notifications-outline",
      iconType: "Ionicons",
      type: "toggle",
      value: notifications,
      onPress: () => setNotifications(!notifications),
      color: "#10B981",
    },
    {
      id: "darkmode",
      title: "Dark Mode",
      subtitle: "Switch between light and dark theme",
      icon: "moon-outline",
      iconType: "Ionicons",
      type: "toggle",
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
      color: "#6366F1",
    },
    {
      id: "haptic",
      title: "Haptic Feedback",
      subtitle: "Feel vibrations on interactions",
      icon: "phone-vibrate",
      iconType: "MaterialCommunityIcons",
      type: "toggle",
      value: hapticFeedback,
      onPress: () => setHapticFeedback(!hapticFeedback),
      color: "#8B5CF6",
    },

    // Data & Privacy
    {
      id: "backup",
      title: "Auto Backup",
      subtitle: "Automatically backup your data",
      icon: "cloud-upload-outline",
      iconType: "Ionicons",
      type: "toggle",
      value: autoBackup,
      onPress: () => setAutoBackup(!autoBackup),
      color: "#06B6D4",
    },
    {
      id: "export",
      title: "Export Data",
      subtitle: "Download your profile data",
      icon: "download-outline",
      iconType: "Ionicons",
      type: "navigation",
      onPress: () => Alert.alert("Export Data", "Your data export will be ready shortly!", [{ text: "OK" }]),
      color: "#84CC16",
    },

    // Help & Support
    {
      id: "tutorial",
      title: "How to Tap",
      subtitle: "Learn how to use NFC features",
      icon: "help-circle-outline",
      iconType: "Ionicons",
      type: "navigation",
      onPress: handleHowToTap,
      color: "#F97316",
    },
    {
      id: "insights",
      title: "Insights & Analytics",
      subtitle: "View your usage statistics",
      icon: "analytics-outline",
      iconType: "Ionicons",
      type: "navigation",
      onPress: handleInsights,
      color: "#EF4444",
    },
    {
      id: "signout",
      title: "Sign Out",
      subtitle: "Sign out of your account",
      icon: "log-out-outline",
      iconType: "Ionicons",
      type: "action",
      onPress: handleSignOut,
      color: "#DC2626",
    },
  ]

  const renderSettingItem = (item: SettingItem, index: number) => {
    const IconComponent = item.iconType === "Ionicons" ? Ionicons : MaterialCommunityIcons

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.settingItem,
          {
            opacity: cardAnims[index],
            transform: [
              {
                translateY: cardAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.settingTouchable} onPress={item.onPress} activeOpacity={0.8}>
          <View style={styles.settingContent}>
            <View style={[styles.settingIcon, { backgroundColor: `${item.color}20` }]}>
              <IconComponent name={item.icon as any} size={24} color={item.color} />
            </View>

            <View style={styles.settingText}>
              <View style={styles.settingTitleRow}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                {item.showBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badgeText}</Text>
                  </View>
                )}
              </View>
              {item.subtitle && <Text style={styles.settingSubtitle}>{item.subtitle}</Text>}
            </View>

            <View style={styles.settingAction}>
              {item.type === "toggle" ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onPress}
                  trackColor={{ false: "#374151", true: `${item.color}40` }}
                  thumbColor={item.value ? item.color : "#9CA3AF"}
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#64748B" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderFloatingElement = () => (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          opacity: floatingAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.8, 0.3],
          }),
          transform: [
            {
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              }),
            },
            {
              scale: floatingAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.2, 0.8],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons name="settings" size={20} color="rgba(245, 158, 11, 0.6)" />
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Background Element */}
      {renderFloatingElement()}

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
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          {/* Settings List */}
          <ScrollView
            style={styles.settingsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.settingsContent}
          >
            {/* Account Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              {settingsData.slice(0, 2).map((item, index) => renderSettingItem(item, index))}
            </View>

            {/* App Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              {settingsData.slice(2, 5).map((item, index) => renderSettingItem(item, index + 2))}
            </View>

            {/* Data & Privacy Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data & Privacy</Text>
              {settingsData.slice(5, 7).map((item, index) => renderSettingItem(item, index + 5))}
            </View>

            {/* Help & Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Help & Support</Text>
              {settingsData.slice(7).map((item, index) => renderSettingItem(item, index + 7))}
            </View>

            {/* App Version */}
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Tapzx v2.1.0</Text>
              <Text style={styles.versionSubtext}>Made with ❤️ for seamless networking</Text>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            <View style={styles.navContainer}>
              {[
                { name: "Home", icon: "home", label: "Home" },
                { name: "Connects", icon: "people", label: "Connects" },
                { name: "Scans", icon: "scan-circle", label: "Scans", isProfile: true },
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
  floatingElement: {
    position: "absolute",
    top: 120,
    right: 30,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSpacer: {
    width: 40,
  },
  settingsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F59E0B",
    marginBottom: 16,
    marginLeft: 4,
  },
  settingItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  settingTouchable: {
    padding: 16,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0F172A",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 20,
  },
  settingAction: {
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 24,
    marginTop: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 20,
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

export default SettingsPage
