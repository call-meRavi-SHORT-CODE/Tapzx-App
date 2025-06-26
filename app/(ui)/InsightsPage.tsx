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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

interface StatCard {
  id: string
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: string
  color: string
  subtitle?: string
}

const InsightsPage = () => {
  const [activeTab, setActiveTab] = useState("Insights")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(30))
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  // Animation refs
  const cardAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current
  const chartAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    startAnimations()
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
        delay: index * 150,
        useNativeDriver: true,
      }).start()
    })

    // Chart animation
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 1200,
      delay: 500,
      useNativeDriver: true,
    }).start()
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

      default:
        break
    }
  }

  const statsData: StatCard[] = [
    {
      id: "profile_views",
      title: "Profile Views",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: "eye-outline",
      color: "#3B82F6",
      subtitle: "This week",
    },
    {
      id: "connections",
      title: "New Connections",
      value: "89",
      change: "+8.2%",
      changeType: "increase",
      icon: "people-outline",
      color: "#10B981",
      subtitle: "This week",
    },
    {
      id: "scans",
      title: "Card Scans",
      value: "156",
      change: "+15.3%",
      changeType: "increase",
      icon: "scan-circle-outline",
      color: "#F59E0B",
      subtitle: "This week",
    },
    {
      id: "engagement",
      title: "Engagement Rate",
      value: "68%",
      change: "-2.1%",
      changeType: "decrease",
      icon: "trending-up-outline",
      color: "#8B5CF6",
      subtitle: "This week",
    },
    {
      id: "top_platform",
      title: "Top Platform",
      value: "LinkedIn",
      change: "45% clicks",
      changeType: "neutral",
      icon: "link-outline",
      color: "#0077B5",
      subtitle: "Most popular",
    },
    {
      id: "response_time",
      title: "Avg Response Time",
      value: "2.3h",
      change: "-30min",
      changeType: "increase",
      icon: "time-outline",
      color: "#06B6D4",
      subtitle: "Getting faster",
    },
  ]

  const periods = [
    { id: "24h", label: "24h" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "90d", label: "90d" },
  ]

  const renderStatCard = (stat: StatCard, index: number) => {
    const changeColor =
      stat.changeType === "increase" ? "#10B981" : stat.changeType === "decrease" ? "#EF4444" : "#64748B"

    const changeIcon =
      stat.changeType === "increase" ? "trending-up" : stat.changeType === "decrease" ? "trending-down" : "remove"

    return (
      <Animated.View
        key={stat.id}
        style={[
          styles.statCard,
          {
            opacity: cardAnims[index],
            transform: [
              {
                translateY: cardAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              {
                scale: cardAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient colors={[`${stat.color}15`, `${stat.color}05`]} style={styles.statCardGradient}>
          <View style={styles.statCardHeader}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <View style={[styles.changeIndicator, { backgroundColor: `${changeColor}20` }]}>
              <Ionicons name={changeIcon as any} size={12} color={changeColor} />
              <Text style={[styles.changeText, { color: changeColor }]}>{stat.change}</Text>
            </View>
          </View>

          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statTitle}>{stat.title}</Text>
          {stat.subtitle && <Text style={styles.statSubtitle}>{stat.subtitle}</Text>}
        </LinearGradient>
      </Animated.View>
    )
  }

  const renderPeriodButton = (period: { id: string; label: string }) => (
    <TouchableOpacity
      key={period.id}
      style={[styles.periodButton, selectedPeriod === period.id && styles.periodButtonActive]}
      onPress={() => setSelectedPeriod(period.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.periodButtonText, selectedPeriod === period.id && styles.periodButtonTextActive]}>
        {period.label}
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
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Insights</Text>
              <TouchableOpacity style={styles.exportButton}>
                <Ionicons name="download-outline" size={20} color="#F59E0B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.periodButtons}>{periods.map(renderPeriodButton)}</View>
            </ScrollView>
          </View>

          {/* Stats Grid */}
          <ScrollView
            style={styles.statsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.statsContent}
          >
            <View style={styles.statsGrid}>{statsData.map((stat, index) => renderStatCard(stat, index))}</View>

            {/* Chart Section */}
            <Animated.View
              style={[
                styles.chartSection,
                {
                  opacity: chartAnim,
                  transform: [
                    {
                      translateY: chartAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(59, 130, 246, 0.1)", "rgba(59, 130, 246, 0.05)"]}
                style={styles.chartContainer}
              >
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Activity Overview</Text>
                  <Text style={styles.chartSubtitle}>Last 7 days</Text>
                </View>

                {/* Simple Chart Representation */}
                <View style={styles.chartBars}>
                  {[65, 45, 80, 35, 90, 55, 75].map((height, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.chartBar,
                        {
                          height: `${height}%`,
                          opacity: chartAnim,
                          transform: [
                            {
                              scaleY: chartAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>

                <View style={styles.chartLabels}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                    <Text key={index} style={styles.chartLabel}>
                      {day}
                    </Text>
                  ))}
                </View>
              </LinearGradient>
            </Animated.View>

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
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  periodSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  periodButtonActive: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  periodButtonTextActive: {
    color: "#0F172A",
    fontWeight: "600",
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContent: {
    paddingBottom: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  statCardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  changeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  chartSection: {
    marginBottom: 24,
  },
  chartContainer: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    marginBottom: 12,
  },
  chartBar: {
    width: 24,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
    minHeight: 8,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chartLabel: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    width: 24,
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

export default InsightsPage
