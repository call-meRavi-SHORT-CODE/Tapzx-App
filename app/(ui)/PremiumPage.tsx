import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface PremiumFeature {
  id: string;
  title: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons';
}

interface PricingPlan {
  id: string;
  title: string;
  badge: string;
  badgeIcon: string;
  originalPrice: string;
  discountedPrice: string;
  isPopular: boolean;
  savings: string;
}

const PremiumPage = () => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [bannerAnim] = useState(new Animated.Value(0));
  
  // Feature animations
  const featureAnims = useRef([...Array(13)].map(() => new Animated.Value(0))).current;
  const featureScaleAnims = useRef([...Array(13)].map(() => new Animated.Value(0.8))).current;
  const featureBounceAnims = useRef([...Array(13)].map(() => new Animated.Value(0))).current;
  
  // Pricing card animations
  const pricingAnims = useRef([...Array(2)].map(() => new Animated.Value(0))).current;
  const pricingScaleAnims = useRef([...Array(2)].map(() => new Animated.Value(0.8))).current;
  
  // Floating elements
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  const premiumFeatures: PremiumFeature[] = [
    { id: '1', title: 'Unlimited Card Scan', icon: 'scan-circle', iconType: 'Ionicons' },
    { id: '2', title: 'Download leads data in Excel sheet', icon: 'download', iconType: 'Ionicons' },
    { id: '3', title: 'Connect your CRM directly to automate leads', icon: 'link', iconType: 'Ionicons' },
    { id: '4', title: 'Use GRID AI', icon: 'grid', iconType: 'Ionicons' },
    { id: '5', title: 'Automate Email and WhatsApp for every lead', icon: 'mail', iconType: 'Ionicons' },
    { id: '6', title: 'Discover and Connect with like minded people', icon: 'people', iconType: 'Ionicons' },
    { id: '7', title: 'Custom filter to connect with people', icon: 'filter', iconType: 'Ionicons' },
    { id: '8', title: 'Connect Google Reviews directly', icon: 'star', iconType: 'Ionicons' },
    { id: '9', title: 'Add unlimited products and services', icon: 'add-circle', iconType: 'Ionicons' },
    { id: '10', title: 'With Prime be on the top of search', icon: 'trending-up', iconType: 'Ionicons' },
    { id: '11', title: 'No watermark on Social Greetings', icon: 'image', iconType: 'Ionicons' },
    { id: '12', title: 'Link your Domain and make link personalized', icon: 'globe', iconType: 'Ionicons' },
    { id: '13', title: 'SEO - get listed on Google', icon: 'search', iconType: 'Ionicons' },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: '1',
      title: '1 Year',
      badge: 'Most Purchased',
      badgeIcon: 'star',
      originalPrice: '5999',
      discountedPrice: '3999',
      isPopular: true,
      savings: 'Save 33%'
    },
    {
      id: '2',
      title: 'Lifetime Membership',
      badge: 'Lightning Deal',
      badgeIcon: 'flash',
      originalPrice: '14999',
      discountedPrice: '12999',
      isPopular: false,
      savings: 'Save 13%'
    }
  ];

  useEffect(() => {
    startAnimations();
    startContinuousAnimations();
  }, []);

  const startAnimations = () => {
    // Initial load animations
    Animated.sequence([
      // Banner animation
      Animated.timing(bannerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Main content
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
      ]),
    ]).start();

    // Staggered feature animations
    featureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });

    featureScaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });

    // Pricing card animations
    pricingAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: 1500 + (index * 200),
        useNativeDriver: true,
      }).start();
    });

    pricingScaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        delay: 1500 + (index * 200),
        useNativeDriver: true,
      }).start();
    });
  };

  const startContinuousAnimations = () => {
    // Floating elements
    const createFloatingAnimation = (animValue: Animated.Value, duration: number, delay: number = 0) => {
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
        ])
      );
    };

    createFloatingAnimation(floatingAnim1, 3000, 0).start();
    createFloatingAnimation(floatingAnim2, 4000, 1000).start();
    createFloatingAnimation(floatingAnim3, 5000, 2000).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous feature bouncing
    featureBounceAnims.forEach((anim, index) => {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
        ])
      );
      
      setTimeout(() => bounceAnimation.start(), index * 200);
    });
  };

  const handleClosePress = () => {
    router.back();
  };

  const handlePurchase = (plan: PricingPlan) => {
    Alert.alert(
      "Purchase Premium",
      `You selected ${plan.title} plan for Rs. ${plan.discountedPrice}/-`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Buy Now", onPress: () => console.log(`Purchasing ${plan.title}`) }
      ]
    );
  };

  const renderFloatingElement = (animValue: Animated.Value, style: any, icon: string) => (
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
                outputRange: [0, -20],
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
      <Ionicons name={icon as any} size={20} color="rgba(245, 158, 11, 0.6)" />
    </Animated.View>
  );

  const renderFeature = (feature: PremiumFeature, index: number) => {
    const IconComponent = feature.iconType === 'Ionicons' ? Ionicons : MaterialCommunityIcons;
    
    const bounceTransform = featureBounceAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5],
    });

    return (
      <Animated.View
        key={feature.id}
        style={[
          styles.featureItem,
          {
            opacity: featureAnims[index],
            transform: [
              { scale: featureScaleAnims[index] },
              { translateY: bounceTransform },
            ],
          },
        ]}
      >
        <View style={styles.featureIconContainer}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.featureIconGradient}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <Text style={styles.featureText}>{feature.title}</Text>
      </Animated.View>
    );
  };

  const renderPricingCard = (plan: PricingPlan, index: number) => (
    <Animated.View
      key={plan.id}
      style={[
        styles.pricingCard,
        plan.isPopular && styles.popularCard,
        {
          opacity: pricingAnims[index],
          transform: [{ scale: pricingScaleAnims[index] }],
        },
      ]}
    >
      <View style={[styles.pricingBadge, plan.isPopular && styles.popularBadge]}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Ionicons 
            name={plan.badgeIcon as any} 
            size={16} 
            color={plan.isPopular ? "#FFD700" : "#F59E0B"} 
          />
        </Animated.View>
        <Text style={[styles.badgeText, plan.isPopular && styles.popularBadgeText]}>
          {plan.badge}
        </Text>
      </View>

      <LinearGradient
        colors={plan.isPopular ? ['#3B82F6', '#1D4ED8'] : ['#1E40AF', '#1E3A8A']}
        style={styles.pricingContent}
      >
        <Text style={styles.planTitle}>{plan.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>Rs. {plan.originalPrice}</Text>
          <Text style={styles.discountedPrice}>Rs. {plan.discountedPrice}/-</Text>
          <Text style={styles.taxText}>+ taxes</Text>
        </View>
        
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => handlePurchase(plan)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#F59E0B', '#FBBF24']}
            style={styles.buyButtonGradient}
          >
            <Text style={styles.buyButtonText}>BUY NOW!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Floating Background Elements */}
      {renderFloatingElement(floatingAnim1, { top: 100, left: 30 }, 'star')}
      {renderFloatingElement(floatingAnim2, { top: 200, right: 40 }, 'flash')}
      {renderFloatingElement(floatingAnim3, { top: 300, left: 50 }, 'diamond')}

      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClosePress}>
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Animated Banner */}
        <Animated.View
          style={[
            styles.bannerContainer,
            {
              opacity: bannerAnim,
              transform: [
                {
                  translateY: bannerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bannerText}>ED PERIOD OFFER</Text>
            <Animated.View
              style={{
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.3, 1],
                    }),
                  },
                ],
              }}
            >
              <Ionicons name="flash" size={20} color="#FFD700" />
            </Animated.View>
            <Text style={styles.bannerText}>LIMITED PERIOD</Text>
          </LinearGradient>
        </Animated.View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.heroTitle}>
                Unlock all the{'\n'}
                <Text style={styles.heroTitleAccent}>Super Powers </Text>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: sparkleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons name="flash" size={32} color="#F59E0B" />
                </Animated.View>
              </Text>
              <Text style={styles.heroSubtitle}>
                become prime today and be in the{'\n'}
                <Text style={styles.heroSubtitleAccent}>top 1% club of Pro Networkers</Text>
              </Text>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              {premiumFeatures.map((feature, index) => renderFeature(feature, index))}
            </View>

            {/* Pricing Cards */}
            <View style={styles.pricingContainer}>
              {pricingPlans.map((plan, index) => renderPricingCard(plan, index))}
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gradient: {
    flex: 1,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  heroTitleAccent: {
    color: '#F59E0B',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  heroSubtitleAccent: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    marginRight: 12,
  },
  featureIconGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  pricingContainer: {
    gap: 20,
    marginBottom: 30,
  },
  pricingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popularCard: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  pricingBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    gap: 6,
  },
  popularBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  popularBadgeText: {
    color: '#FFD700',
  },
  pricingContent: {
    padding: 24,
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  originalPrice: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  taxText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buyButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default PremiumPage;