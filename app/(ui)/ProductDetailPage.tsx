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
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"

const { width, height } = Dimensions.get("window")

const ProductDetailPage = () => {
  const params = useLocalSearchParams()
  const {
    productId,
    productName,
    productPrice,
    productOriginalPrice,
    productImage,
    productDescription,
    productRating,
    productReviews,
    productFeatures,
    productDiscount,
  } = params

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("Gold")
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [imageAnim] = useState(new Animated.Value(0))
  const [bounceAnim] = useState(new Animated.Value(0))

  const features = productFeatures ? JSON.parse(productFeatures as string) : []
  const colors = ["Gold", "Black", "Silver"]

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
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()

    // Continuous bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }

  const handleBackPress = (): void => {
    router.back()
  }

  const handleAddToCart = (): void => {
    Alert.alert("Added to Cart", `${productName} (${quantity} item${quantity > 1 ? "s" : ""}) added to cart!`, [
      { text: "OK" },
    ])
  }

  const handleBuyNow = (): void => {
    Alert.alert("Buy Now", `Proceeding to checkout for ${productName}`, [
      { text: "Cancel", style: "cancel" },
      { text: "Continue", onPress: () => console.log("Proceeding to payment") },
    ])
  }

  const adjustQuantity = (increment: boolean): void => {
    if (increment) {
      setQuantity((prev) => prev + 1)
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="bag" size={24} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Product Image */}
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: imageAnim,
                  transform: [
                    {
                      translateY: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(245, 158, 11, 0.1)", "rgba(245, 158, 11, 0.05)"]}
                style={styles.imageGradient}
              >
                <Image source={{ uri: productImage as string }} style={styles.productImage} />
                <TouchableOpacity style={styles.zoomButton}>
                  <Ionicons name="expand" size={20} color="#F59E0B" />
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{productName}</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={16}
                      color={i < Math.floor(Number.parseFloat(productRating as string)) ? "#FFD700" : "#64748B"}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>Based on {productReviews} reviews from</Text>
                <View style={styles.platformIcons}>
                  <Ionicons name="logo-google" size={16} color="#4285F4" />
                  <MaterialCommunityIcons name="microsoft-azure" size={16} color="#0078D4" />
                  <Ionicons name="logo-apple" size={16} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.priceContainer}>
                {productOriginalPrice && <Text style={styles.originalPrice}>Rs. {productOriginalPrice}</Text>}
                <Text style={styles.currentPrice}>Rs. {productPrice}</Text>
              </View>

              <Text style={styles.productDescription}>{productDescription}</Text>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {features.map((feature: string, index: number) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Color Selection */}
              <View style={styles.colorSection}>
                <Text style={styles.sectionTitle}>Color</Text>
                <View style={styles.colorOptions}>
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[styles.colorOption, selectedColor === color && styles.selectedColorOption]}
                      onPress={() => setSelectedColor(color)}
                    >
                      <Text style={[styles.colorText, selectedColor === color && styles.selectedColorText]}>
                        {color}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quantity */}
              <View style={styles.quantitySection}>
                <Text style={styles.sectionTitle}>Quantity</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(false)}>
                    <Ionicons name="remove" size={20} color="#F59E0B" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity style={styles.quantityButton} onPress={() => adjustQuantity(true)}>
                    <Ionicons name="add" size={20} color="#F59E0B" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} activeOpacity={0.8}>
                  <Text style={styles.addToCartText}>Add To Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow} activeOpacity={0.8}>
                  <LinearGradient colors={["#F59E0B", "#FBBF24"]} style={styles.buyNowGradient}>
                    <Text style={styles.buyNowText}>BUY NOW</Text>
                    <Ionicons name="arrow-forward" size={16} color="#0F172A" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Order Timeline */}
              <View style={styles.timelineContainer}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineIcon}>
                    <Ionicons name="bag" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Order Today</Text>
                    <Text style={styles.timelineDate}>26 Jun</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineItem}>
                  <View style={styles.timelineIcon}>
                    <Ionicons name="construct" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Design confirmed</Text>
                    <Text style={styles.timelineDate}>28 Jun - 29 Jun</Text>
                  </View>
                </View>

                <View style={styles.timelineLine} />

                <View style={styles.timelineItem}>
                  <View style={styles.timelineIcon}>
                    <Ionicons name="car" size={20} color="#F59E0B" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>Order Shipped</Text>
                    <Text style={styles.timelineDate}>1 Jul - 2 Jul</Text>
                  </View>
                </View>
              </View>

              {/* Guarantees */}
              <View style={styles.guaranteesContainer}>
                <View style={styles.guaranteeItem}>
                  <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
                  <Text style={styles.guaranteeText}>90-days refund</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <Ionicons name="leaf" size={24} color="#10B981" />
                  <Text style={styles.guaranteeText}>Eco friendly</Text>
                </View>
                <View style={styles.guaranteeItem}>
                  <Ionicons name="person" size={24} color="#3B82F6" />
                  <Text style={styles.guaranteeText}>Design assistance</Text>
                </View>
              </View>

              {/* Bottom Spacing */}
              <View style={styles.bottomSpacing} />
            </View>
          </Animated.View>
        </ScrollView>

        {/* WhatsApp Button */}
        <TouchableOpacity style={styles.whatsappButton} activeOpacity={0.8}>
          <LinearGradient colors={["#25D366", "#128C7E"]} style={styles.whatsappGradient}>
            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: "90%",
    height: "90%",
    borderRadius: 15,
  },
  zoomButton: {
    position: "absolute",
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#94A3B8",
    marginRight: 8,
  },
  platformIcons: {
    flexDirection: "row",
    gap: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  originalPrice: {
    fontSize: 18,
    color: "#64748B",
    textDecorationLine: "line-through",
    marginRight: 12,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: "800",
    color: "#F59E0B",
  },
  productDescription: {
    fontSize: 16,
    color: "#94A3B8",
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
    flex: 1,
  },
  colorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
  },
  colorOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedColorOption: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  colorText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedColorText: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginHorizontal: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  buyNowButton: {
    flex: 1,
    borderRadius: 25,
    overflow: "hidden",
  },
  buyNowGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  timelineContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  timelineDate: {
    fontSize: 14,
    color: "#64748B",
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: "#F59E0B",
    marginLeft: 19,
    marginVertical: 8,
  },
  guaranteesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  guaranteeItem: {
    alignItems: "center",
    flex: 1,
  },
  guaranteeText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
  },
  whatsappButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: "hidden",
  },
  whatsappGradient: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSpacing: {
    height: 40,
  },
})

export default ProductDetailPage
