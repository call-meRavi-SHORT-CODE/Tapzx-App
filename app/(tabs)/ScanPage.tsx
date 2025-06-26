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
  Image,
  Alert,
  FlatList,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

interface ScannedUser {
  id: string
  name: string
  jobTitle: string
  company: string
  profileImage: string
  cardColor: string[]
  scannedAt: string
  location: string
  verified: boolean
}

const ScanPage = () => {
  const [scanCount, setScanCount] = useState(0) // START WITH 0 SCANS
  const [maxScans] = useState(50)
  const [isPremium, setIsPremium] = useState(false)
  const [activeTab, setActiveTab] = useState("Scans")
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]) // START EMPTY

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [pulseAnim] = useState(new Animated.Value(1))
  const [scanButtonAnim] = useState(new Animated.Value(0))
  const [headerAnim] = useState(new Animated.Value(0))
  const floatingAnim = useRef(new Animated.Value(0)).current

  // Demo users that can be "scanned" (simulating real scan results)
  const availableUsers: ScannedUser[] = [
    {
      id: "user_1",
      name: "Alex Johnson",
      jobTitle: "Senior Product Manager",
      company: "TechCorp Inc.",
      profileImage: "/placeholder.svg?height=100&width=100",
      cardColor: ["#667eea", "#764ba2"],
      scannedAt: "Just now",
      location: "San Francisco",
      verified: true,
    },
    {
      id: "user_2",
      name: "Sarah Chen",
      jobTitle: "UX Designer",
      company: "Design Studio",
      profileImage: "/placeholder.svg?height=100&width=100",
      cardColor: ["#f093fb", "#f5576c"],
      scannedAt: "Just now",
      location: "New York",
      verified: true,
    },
    {
      id: "user_3",
      name: "Michael Rodriguez",
      jobTitle: "Full Stack Developer",
      company: "StartupXYZ",
      profileImage: "/placeholder.svg?height=100&width=100",
      cardColor: ["#4facfe", "#00f2fe"],
      scannedAt: "Just now",
      location: "Austin",
      verified: false,
    },
    {
      id: "user_4",
      name: "Emily Watson",
      jobTitle: "Marketing Director",
      company: "BrandCo",
      profileImage: "/placeholder.svg?height=100&width=100",
      cardColor: ["#43e97b", "#38f9d7"],
      scannedAt: "Just now",
      location: "Los Angeles",
      verified: true,
    },
    {
      id: "user_5",
      name: "David Kim",
      jobTitle: "Data Scientist",
      company: "AI Solutions",
      profileImage: "/placeholder.svg?height=100&width=100",
      cardColor: ["#fa709a", "#fee140"],
      scannedAt: "Just now",
      location: "Seattle",
      verified: true,
    },
  ]

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
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const startContinuousAnimations = (): void => {
    // Subtle pulse animation for scan button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Floating animation for empty state
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

    // Subtle scan button glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanButtonAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanButtonAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const handleScan = (): void => {
    // CHECK SCAN LIMIT FIRST
    if (!isPremium && scanCount >= maxScans) {
      Alert.alert(
        "Scan Limit Reached! 🚫",
        `You've reached your free scan limit of ${maxScans}. Upgrade to Premium for unlimited scans!`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade Now", onPress: () => router.push("/(ui)/PremiumPage") },
        ],
      )
      return
    }

    // SIMULATE SCANNING A RANDOM USER
    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]

    // Check if user already scanned
    const alreadyScanned = scannedUsers.find((user) => user.id === randomUser.id)
    if (alreadyScanned) {
      Alert.alert("Already Scanned! 📱", "You've already scanned this person's profile.", [{ text: "OK" }])
      return
    }

    // ADD TO SCANNED USERS
    const newScannedUser = {
      ...randomUser,
      scannedAt: "Just now",
    }

    setScannedUsers((prev) => [newScannedUser, ...prev])
    setScanCount((prev) => prev + 1)

    // SUCCESS FEEDBACK
    Alert.alert("Scan Successful! ✅", `Successfully scanned ${randomUser.name}'s profile!`, [
      { text: "View Profile", onPress: () => handleCardPress(newScannedUser) },
    ])
  }

  const handleUpgrade = (): void => {
    router.push("/(ui)/PremiumPage")
  }

  const handleCardPress = (user: ScannedUser): void => {
    // Navigate to THAT USER'S landing page (not current user's)
    router.push({
      pathname: "/(ui)/UserProfileLandingPage",
      params: {
        userId: user.id,
        userName: user.name,
        userTitle: user.jobTitle,
        userCompany: user.company,
        userImage: user.profileImage,
        userLocation: user.location,
        userVerified: user.verified.toString(),
        isScannedProfile: "true", // Flag to show this is someone else's profile
      },
    })
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

  const renderScannedCard = ({ item, index }: { item: ScannedUser; index: number }) => {
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={() => handleCardPress(item)} activeOpacity={0.9} style={styles.cardTouchable}>
          <LinearGradient
            colors={item.cardColor as [string, string, ...string[]]}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.cardChip}>
                <Ionicons name="wifi" size={16} color="#FFFFFF" />
              </View>
              {item.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                </View>
              )}
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
                <View style={styles.onlineIndicator} />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.userName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {item.jobTitle}
                </Text>
                <Text style={styles.company} numberOfLines={1}>
                  {item.company}
                </Text>
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={12} color="rgba(255, 255, 255, 0.8)" />
                <Text style={styles.location}>{item.location}</Text>
              </View>
              <Text style={styles.scannedTime}>{item.scannedAt}</Text>
            </View>

            {/* NFC Symbol */}
            <View style={styles.nfcSymbol}>
              <MaterialCommunityIcons name="nfc-tap" size={20} color="rgba(255, 255, 255, 0.6)" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderEmptyState = () => (
    <Animated.View
      style={[
        styles.emptyState,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: floatingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.emptyIconContainer}>
        <LinearGradient
          colors={["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.1)"] as [string, string]}
          style={styles.emptyIconGradient}
        >
          <Ionicons name="scan-circle-outline" size={80} color="#F59E0B" />
        </LinearGradient>
      </View>
      <Text style={styles.emptyTitle}>No cards found</Text>
      <Text style={styles.emptySubtitle}>Start scanning NFC cards to build your network</Text>
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"] as [string, string, string]} style={styles.gradient}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header with Scan Counter */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.scanCounter}>
              <Text style={styles.scanCountText}>
                {scanCount}/{isPremium ? "∞" : maxScans} Scans
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min((scanCount / maxScans) * 100, 100)}%`,
                        backgroundColor: scanCount >= maxScans ? "#EF4444" : "#F59E0B",
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={handleUpgrade} style={styles.upgradeButton} activeOpacity={0.8}>
              <LinearGradient colors={["#3B82F6", "#1D4ED8"] as [string, string]} style={styles.upgradeGradient}>
                <Text style={styles.upgradeText}>Unlock unlimited scans</Text>
                <Ionicons name="diamond" size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Scanned Cards List */}
          <View style={styles.cardsContainer}>
            {scannedUsers.length > 0 ? (
              <FlatList
                data={scannedUsers}
                renderItem={renderScannedCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.cardRow}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.cardsList}
              />
            ) : (
              renderEmptyState()
            )}
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            <View style={styles.navContainer}>
              {[
                { name: "Home", icon: "home" as keyof typeof Ionicons.glyphMap, label: "Home" },
                { name: "Connects", icon: "people" as keyof typeof Ionicons.glyphMap, label: "Connects" },
                {
                  name: "Scans",
                  icon: "scan-circle" as keyof typeof Ionicons.glyphMap,
                  label: "Scans",
                  isProfile: true,
                },
                { name: "Shop", icon: "storefront" as keyof typeof Ionicons.glyphMap, label: "Shop" },
                { name: "Insights", icon: "settings" as keyof typeof Ionicons.glyphMap, label: "Settings" },
              ].map((tab) => (
                <TouchableOpacity
                  key={tab.name}
                  style={[styles.navItem, tab.isProfile && styles.navProfileItem]}
                  onPress={() => handleTabPress(tab.name)}
                  activeOpacity={0.7}
                >
                  {tab.isProfile ? (
                    <View style={styles.navProfileIcon}>
                      <Ionicons name={tab.icon} size={24} color={activeTab === tab.name ? "#F59E0B" : "#64748B"} />
                    </View>
                  ) : (
                    <Ionicons name={tab.icon} size={20} color={activeTab === tab.name ? "#F59E0B" : "#64748B"} />
                  )}
                  <Text style={[styles.navLabel, activeTab === tab.name && styles.navLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ELEGANT SCAN BUTTON - INTEGRATED INTO BOTTOM NAV */}
            <Animated.View
              style={[
                styles.scanButtonContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <TouchableOpacity onPress={handleScan} style={styles.scanButton} activeOpacity={0.8}>
                <LinearGradient colors={["#3B82F6", "#1D4ED8"] as [string, string]} style={styles.scanButtonGradient}>
                  <MaterialCommunityIcons name="qrcode-scan" size={20} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Scan</Text>
                  <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scanCounter: {
    marginBottom: 16,
  },
  scanCountText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  upgradeButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardsList: {
    paddingBottom: 20,
  },
  cardRow: {
    justifyContent: "space-between",
  },
  cardContainer: {
    width: (width - 60) / 2,
    marginBottom: 16,
  },
  cardTouchable: {
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    padding: 16,
    borderRadius: 20,
    minHeight: 180,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardChip: {
    width: 32,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 12,
    padding: 4,
  },
  profileSection: {
    flex: 1,
    justifyContent: "center",
  },
  profileImageContainer: {
    alignSelf: "center",
    marginBottom: 12,
    position: "relative",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "#10B981",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    textAlign: "center",
  },
  jobTitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
    textAlign: "center",
  },
  company: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  scannedTime: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
  },
  nfcSymbol: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomNavigation: {
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 10,
    borderRadius: 35,
    position: "relative",
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
  // NEW ELEGANT SCAN BUTTON STYLES
  scanButtonContainer: {
    position: "absolute",
    top: -25,
    left: "50%",
    marginLeft: -80,
    width: 160,
  },
  scanButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})

export default ScanPage
