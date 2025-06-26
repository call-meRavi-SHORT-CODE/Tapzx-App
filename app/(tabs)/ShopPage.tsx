"use client"

import type React from "react"
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
  Image,
  type ViewStyle,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

interface Product {
  id: string
  name: string
  price: string
  originalPrice?: string
  image: string
  category: string
  rating: number
  reviews: string
  description: string
  features: string[]
  isPopular?: boolean
  discount?: string
}

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState("Shop")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [scaleAnim] = useState(new Animated.Value(0.8))

  // Product card animations
  const cardAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current
  const cardScaleAnims = useRef([...Array(5)].map(() => new Animated.Value(0.8))).current
  const cardBounceAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current

  // Floating elements
  const floatingAnim1 = useRef(new Animated.Value(0)).current
  const floatingAnim2 = useRef(new Animated.Value(0)).current
  const sparkleAnim = useRef(new Animated.Value(0)).current

  const products: Product[] = [
    {
      id: "1",
      name: "Exclusive Metal Card",
      price: "2,499.00",
      originalPrice: "3,500.00",
      image: "/placeholder.svg?height=200&width=300",
      category: "Premium",
      rating: 4.8,
      reviews: "11,000+",
      description: "Exclusive Metal Card – Where Luxury Meets Smart Networking",
      features: [
        "Instant Connections",
        "Free Application",
        "Custom Designed",
        "Ditch Paper Cards",
        "Ultimate Convenience",
        "One-Time Purchase Lifetime Value",
      ],
      isPopular: true,
      discount: "30% OFF",
    },
    {
      id: "2",
      name: "Smart Standees",
      price: "1,449.00",
      originalPrice: "1,699.00",
      image: "/placeholder.svg?height=200&width=300",
      category: "Business",
      rating: 4.7,
      reviews: "10,000+",
      description: "5-in-1 Stand to Boost Reviews & Engagement 🚀",
      features: [
        "Get More Google Reviews",
        "Share All Your Business Links Instantly",
        "Grow Social Media Followers",
        "Collect Leads with 1 Tap",
        "Custom Branded for Your Business",
      ],
      discount: "15% OFF",
    },
    {
      id: "3",
      name: "Fully Customizable NFC Cards",
      price: "1,249.00",
      originalPrice: "1,499.00",
      image: "/placeholder.svg?height=200&width=300",
      category: "Standard",
      rating: 4.6,
      reviews: "10,000+",
      description: "Customised Business NFC Card (PVC)",
      features: [
        "Instant Connections",
        "Free Application",
        "Custom Designed",
        "Ditch Paper Cards",
        "Ultimate Convenience",
        "One-Time Purchase",
      ],
      discount: "17% OFF",
    },
    {
      id: "4",
      name: "Direct Review Cards",
      price: "500.00",
      originalPrice: "600.00",
      image: "/placeholder.svg?height=200&width=300",
      category: "Reviews",
      rating: 4.5,
      reviews: "10,000+",
      description: "Effortlessly manage reviews or grow your followers/subscribers",
      features: [
        "Google Review Integration",
        "Social Media Growth",
        "QR Code Technology",
        "Instant Setup",
        "Custom Branding",
      ],
      discount: "17% OFF",
    },
    {
      id: "5",
      name: "Review NFC Stickers",
      price: "500.00",
      originalPrice: "799.00",
      image: "/placeholder.svg?height=200&width=300",
      category: "Stickers",
      rating: 4.4,
      reviews: "10,000+",
      description: "Direct Review Stickers (NFC + QR code)",
      features: [
        "NFC-powered Technology",
        "Dynamic QR Code",
        "Waterproof Design",
        "Easy Application",
        "Instant Information Sharing",
      ],
      discount: "37% OFF",
    },
  ]

  useEffect(() => {
    startAnimations()
    startContinuousAnimations()
  }, [])

  const startAnimations = (): void => {
    // Main content animations
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()

    // Staggered card animations
    cardAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 200,
        useNativeDriver: true,
      }).start()
    })

    cardScaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        delay: index * 200,
        useNativeDriver: true,
      }).start()
    })
  }

  const startContinuousAnimations = (): void => {
    // Floating elements
    const createFloatingAnimation = (
      animValue: Animated.Value,
      duration: number,
      delay = 0,
    ): Animated.CompositeAnimation => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
      )
    }

    createFloatingAnimation(floatingAnim1, 3000, 0).start()
    createFloatingAnimation(floatingAnim2, 4000, 1000).start()

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Card bounce animations
    cardBounceAnims.forEach((anim, index) => {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + index * 300,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 2000 + index * 300,
            useNativeDriver: true,
          }),
        ]),
      )

      setTimeout(() => bounceAnimation.start(), index * 400)
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

      case "Scans":
        router.push("/(tabs)/ScanPage")
        break

      case "Insights":
        router.push("/(tabs)/SettingsPage") // ADD THIS LINE
        break


      

      default:
        break
    }
  }

  const handleProductPress = (product: Product): void => {
    router.push({
      pathname: "/(ui)/ProductDetailPage",
      params: {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productOriginalPrice: product.originalPrice || "",
        productImage: product.image,
        productDescription: product.description,
        productRating: product.rating.toString(),
        productReviews: product.reviews,
        productFeatures: JSON.stringify(product.features),
        productDiscount: product.discount || "",
      },
    })
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { contentOffset } = event.nativeEvent
    console.log("Scroll offset:", contentOffset.y)
  }

  const renderFloatingElement = (
    animValue: Animated.Value,
    style: ViewStyle,
    iconName: keyof typeof Ionicons.glyphMap,
  ): React.ReactElement => (
    <Animated.View
      style={[
        styles.floatingElement,
        style,
        {
          opacity: animValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 0.8, 0.3],
          }),
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -15],
              }),
            },
            {
              scale: animValue.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.2, 0.8],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons name={iconName} size={16} color="rgba(245, 158, 11, 0.6)" />
    </Animated.View>
  )

  const renderProductCard = (product: Product, index: number): React.ReactElement => {
    const bounceTransform = cardBounceAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8],
    })

    return (
      <Animated.View
        key={product.id}
        style={[
          styles.productCard,
          product.isPopular && styles.popularCard,
          {
            opacity: cardAnims[index],
            transform: [{ scale: cardScaleAnims[index] }, { translateY: bounceTransform }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => handleProductPress(product)} activeOpacity={0.9} style={styles.cardTouchable}>
          {/* Discount Badge */}
          {product.discount && (
            <View style={[styles.discountBadge, product.isPopular && styles.popularDiscountBadge]}>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="flash" size={12} color="#FFFFFF" />
              </Animated.View>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}

          {/* Product Image */}
          <View style={styles.imageContainer}>
            <LinearGradient
              colors={["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]}
              style={styles.imageGradient}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
            </LinearGradient>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>

            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={12}
                    color={i < Math.floor(product.rating) ? "#FFD700" : "#64748B"}
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>({product.reviews} reviews)</Text>
            </View>

            <Text style={styles.productDescription} numberOfLines={2}>
              {product.description}
            </Text>

            <View style={styles.priceContainer}>
              {product.originalPrice && <Text style={styles.originalPrice}>Rs. {product.originalPrice}</Text>}
              <Text style={styles.currentPrice}>Rs. {product.price}</Text>
            </View>

            <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
              <LinearGradient colors={["#F59E0B", "#FBBF24"]} style={styles.buyButtonGradient}>
                <Text style={styles.buyButtonText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#0F172A" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Background Elements */}
      {renderFloatingElement(floatingAnim1, { top: 120, left: 30 }, "storefront")}
      {renderFloatingElement(floatingAnim2, { top: 200, right: 40 }, "card")}

      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
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
                <Text style={styles.logoText}>Tapzx Shop</Text>
              </View>
            </View>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.1, 1],
                    }),
                  },
                ],
              }}
            >
              <Text style={styles.heroTitle}>Premium NFC Products</Text>
            </Animated.View>
            <Text style={styles.heroSubtitle}>Transform your networking with our smart solutions</Text>
          </View>

          {/* Products Grid */}
          <ScrollView
            style={styles.productsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productsContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {products.map((product, index) => renderProductCard(product, index))}

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>

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
    zIndex: 1,
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
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productsContent: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  popularCard: {
    borderColor: "#F59E0B",
    borderWidth: 2,
  },
  cardTouchable: {
    flex: 1,
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  popularDiscountBadge: {
    backgroundColor: "#F59E0B",
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  imageContainer: {
    height: 180,
    margin: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  imageGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "80%",
    height: "80%",
    borderRadius: 10,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewText: {
    fontSize: 12,
    color: "#64748B",
  },
  productDescription: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 12,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 16,
    color: "#64748B",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F59E0B",
  },
  buyButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
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

export default ShopPage
