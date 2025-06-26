"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

interface Connect {
  id: string
  name: string
  lastMessage: string
  profileImage: string
  isOnline: boolean
  lastSeen: string
  jobTitle: string
  badge?: "crown" | "verified" | null
}

interface FilterTag {
  id: string
  title: string
  count: number
}

const ConnectsPage = () => {
  const [activeTab, setActiveTab] = useState("Connects")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))

  // Sample connects data
  const [connects] = useState<Connect[]>([
    {
      id: "1",
      name: "Shubham Agrawal",
      lastMessage: "Hji",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "20/06/2025",
      jobTitle: "Business Owner",
      badge: "crown",
    },
    {
      id: "2",
      name: "Priya Sharma",
      lastMessage: "Thanks for connecting!",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastSeen: "Online",
      jobTitle: "Investor",
      badge: "verified",
    },
    {
      id: "3",
      name: "Rahul Kumar",
      lastMessage: "Let's discuss the project",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "19/06/2025",
      jobTitle: "Developer",
      badge: null,
    },
    {
      id: "4",
      name: "Anjali Patel",
      lastMessage: "Great meeting you!",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      lastSeen: "Online",
      jobTitle: "Business Owner",
      badge: "crown",
    },
    {
      id: "5",
      name: "Vikram Singh",
      lastMessage: "Looking forward to collaborate",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "18/06/2025",
      jobTitle: "Investor",
      badge: "verified",
    },
  ])

  // Filter tags
  const filterTags: FilterTag[] = [
    { id: "All", title: "All", count: connects.length },
    {
      id: "Business Owner",
      title: "Business Owner",
      count: connects.filter((c) => c.jobTitle === "Business Owner").length,
    },
    { id: "Investor", title: "Investor", count: connects.filter((c) => c.jobTitle === "Investor").length },
    { id: "Developer", title: "Developer", count: connects.filter((c) => c.jobTitle === "Developer").length },
  ]

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

  const filteredConnects = connects.filter((connect) => {
    const matchesSearch = connect.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All" || connect.jobTitle === selectedFilter
    return matchesSearch && matchesFilter
  })

  const handleConnectPress = (connect: Connect) => {
    router.push({
      pathname: "/(ui)/ChatPage",
      params: {
        userId: connect.id,
        userName: connect.name,
        userImage: connect.profileImage,
        isOnline: connect.isOnline.toString(),
        lastSeen: connect.lastSeen,
      },
    })
  }

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName)

    switch (tabName) {
      case "Home":
        router.push("/(tabs)/HomePage")
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

  const renderBadge = (badge: "crown" | "verified" | null | undefined) => {
    if (!badge) return null

    return (
      <View style={styles.badgeContainer}>
        {badge === "crown" ? (
          <MaterialCommunityIcons name="crown" size={16} color="#FFD700" />
        ) : (
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        )}
      </View>
    )
  }

  const renderConnect = ({ item }: { item: Connect }) => (
    <TouchableOpacity style={styles.connectItem} onPress={() => handleConnectPress(item)} activeOpacity={0.8}>
      <View style={styles.connectContent}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: item.profileImage }} style={styles.connectImage} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.connectInfo}>
          <View style={styles.connectHeader}>
            <Text style={styles.connectName}>{item.name}</Text>
            {renderBadge(item.badge)}
          </View>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>

        <View style={styles.connectMeta}>
          <Text style={styles.lastSeen}>{item.lastSeen}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderFilterTag = (tag: FilterTag) => (
    <TouchableOpacity
      key={tag.id}
      style={[styles.filterTag, selectedFilter === tag.id && styles.filterTagActive]}
      onPress={() => setSelectedFilter(tag.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterTagText, selectedFilter === tag.id && styles.filterTagTextActive]}>
        {tag.title} ({tag.count})
      </Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
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
          <View style={styles.header}></View>

          {/* Search and Export */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Looking for a Prof..."
                placeholderTextColor="#64748B"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <TouchableOpacity
              style={styles.exportButton}
              activeOpacity={0.8}
              onPress={() => router.push("/(ui)/PremiumPage")}
            >
              <MaterialCommunityIcons name="crown" size={20} color="#F59E0B" />
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tags */}
          <View style={styles.filtersContainer}>
            <TouchableOpacity style={styles.addFilterButton} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color="#F59E0B" />
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
              {filterTags.map(renderFilterTag)}
            </ScrollView>
          </View>

          {/* Connects List */}
          <FlatList
            data={filteredConnects}
            renderItem={renderConnect}
            keyExtractor={(item) => item.id}
            style={styles.connectsList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
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
    transform: [{ rotate: "45deg" }],
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    gap: 8,
  },
  exportText: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  addFilterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 2,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  filtersScroll: {
    flex: 1,
  },
  filterTag: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  filterTagActive: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  filterTagText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  filterTagTextActive: {
    color: "#0F172A",
    fontWeight: "600",
  },
  connectsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  connectItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  connectContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  connectImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#0F172A",
  },
  connectInfo: {
    flex: 1,
  },
  connectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  connectName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  badgeContainer: {
    marginLeft: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#94A3B8",
  },
  connectMeta: {
    alignItems: "flex-end",
  },
  lastSeen: {
    fontSize: 12,
    color: "#64748B",
  },
  separator: {
    height: 12,
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

export default ConnectsPage
