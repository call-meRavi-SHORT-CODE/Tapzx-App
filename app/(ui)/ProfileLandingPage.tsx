import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from "expo-router"


const { width, height } = Dimensions.get('window');
const PROFILE_IMAGE_HEIGHT = height * 0.6; // 60% of screen height

type IconData = {
  name: string;
  type: 'Ionicons' | 'FontAwesome' | 'MaterialIcons';
  color: string;
  bgColor: string;
  gradientColors: [string, string] | [string, string, string];
};

interface NavigationProp {
  goBack?: () => void;
  navigate?: (screen: string) => void;
}

interface ProfileLandingPageProps {
  navigation?: NavigationProp;
}

const ProfileLandingPage: React.FC<ProfileLandingPageProps> = ({ navigation }) => {
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  
  // Continuous bouncing animations for icons
  const iconBounceAnims = useRef([...Array(7)].map(() => new Animated.Value(0))).current;
  const iconRotateAnims = useRef([...Array(7)].map(() => new Animated.Value(0))).current;
  const iconScaleAnims = useRef([...Array(7)].map(() => new Animated.Value(1))).current;
  
  // Star animations
  const starAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const starRotateAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  
  // Floating elements
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;
  const floatingAnim3 = useRef(new Animated.Value(0)).current;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setIsLoaded(true);
      startContinuousAnimations();
    });

    // Floating background elements
    startFloatingAnimations();
  }, []);

  const startFloatingAnimations = (): void => {
    const createFloatingAnimation = (
      animValue: Animated.Value, 
      duration: number, 
      delay: number = 0
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
        ])
      );
    };

    createFloatingAnimation(floatingAnim1, 3000, 0).start();
    createFloatingAnimation(floatingAnim2, 4000, 1000).start();
    createFloatingAnimation(floatingAnim3, 5000, 2000).start();
  };

  const startContinuousAnimations = (): void => {
    // Continuous bouncing icons
    iconBounceAnims.forEach((anim, index) => {
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 800 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800 + (index * 100),
            useNativeDriver: true,
          }),
        ])
      );
      
      setTimeout(() => bounceAnimation.start(), index * 200);
    });

    // Continuous rotation for icons
    iconRotateAnims.forEach((anim, index) => {
      const rotateAnimation = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + (index * 500),
          useNativeDriver: true,
        })
      );
      
      setTimeout(() => rotateAnimation.start(), index * 300);
    });

    // Continuous scale pulse for icons
    iconScaleAnims.forEach((anim, index) => {
      const scaleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.2,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000 + (index * 100),
            useNativeDriver: true,
          }),
        ])
      );
      
      setTimeout(() => scaleAnimation.start(), index * 400);
    });

    // Continuous star animations
    starAnims.forEach((anim, index) => {
      const starAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.5,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      
      setTimeout(() => starAnimation.start(), index * 300);
    });

    // Star rotation
    starRotateAnims.forEach((anim, index) => {
      const rotateAnimation = Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + (index * 200),
          useNativeDriver: true,
        })
      );
      
      setTimeout(() => rotateAnimation.start(), index * 100);
    });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const opacity = Math.min(offsetY / 200, 1);
        headerOpacity.setValue(opacity);
      }
    }
  );

  const handleEditPress = (): void => {
    router.push("/(tabs)/EditProfile");
  };

  const handleBackPress = (): void => {
    router.push("/(tabs)/HomePage");

    
  };

  const handleShareProfile = () => {
    Alert.alert("Share Profile", "Profile sharing functionality will be implemented here", [{ text: "OK" }])
  }
  

  const socialIcons: IconData[] = [
    { 
      name: 'call', 
      type: 'Ionicons', 
      color: '#FFFFFF', 
      bgColor: '#007AFF',
      gradientColors: ['#007AFF', '#0056CC']
    },
    { 
      name: 'whatsapp', 
      type: 'FontAwesome', 
      color: '#FFFFFF', 
      bgColor: '#25D366',
      gradientColors: ['#25D366', '#1DA851']
    },
    { 
      name: 'send', 
      type: 'Ionicons', 
      color: '#FFFFFF', 
      bgColor: '#FF1744',
      gradientColors: ['#FF1744', '#D50000']
    },
    { 
      name: 'mail', 
      type: 'Ionicons', 
      color: '#FFFFFF', 
      bgColor: '#FF5722',
      gradientColors: ['#FF5722', '#E64A19']
    },
    { 
      name: 'linkedin', 
      type: 'FontAwesome', 
      color: '#FFFFFF', 
      bgColor: '#0077B5',
      gradientColors: ['#0077B5', '#005885']
    },
    { 
      name: 'instagram', 
      type: 'FontAwesome', 
      color: '#FFFFFF', 
      bgColor: '#E4405F',
      gradientColors: ['#E4405F', '#C13584', '#833AB4']
    },
    { 
      name: 'facebook', 
      type: 'FontAwesome', 
      color: '#FFFFFF', 
      bgColor: '#1877F2',
      gradientColors: ['#1877F2', '#166FE5']
    },
  ];

  const renderFloatingElement = (
    animValue: Animated.Value, 
    style: ViewStyle, 
    icon: keyof typeof Ionicons.glyphMap
  ) => (
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
      <Ionicons name={icon} size={20} color="rgba(245, 158, 11, 0.6)" />
    </Animated.View>
  );

  const renderSocialIcon = (iconData: IconData, index: number) => {
    const IconComponent =
      iconData.type === 'Ionicons'
        ? Ionicons
        : iconData.type === 'MaterialIcons'
        ? MaterialIcons
        : FontAwesome;

    const bounceTransform = iconBounceAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -15],
    });

    const rotateTransform = iconRotateAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const scaleTransform = iconScaleAnims[index];

    return (
      <Animated.View
        key={index}
        style={[
          styles.socialIconContainer,
          {
            transform: [
              { translateY: bounceTransform },
              { scale: scaleTransform },
              { rotate: rotateTransform },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.socialIconButton}
          activeOpacity={0.8}
          onPress={() => console.log(`Pressed ${iconData.name}`)}
        >
          <LinearGradient
            colors={iconData.gradientColors}
            style={styles.socialIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <IconComponent 
              name={iconData.name as any} 
              size={28} 
              color={iconData.color} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const parallaxImageTransform = scrollY.interpolate({
    inputRange: [0, PROFILE_IMAGE_HEIGHT],
    outputRange: [0, -PROFILE_IMAGE_HEIGHT * 0.3],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, PROFILE_IMAGE_HEIGHT * 0.8],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Floating Background Elements */}
      {renderFloatingElement(floatingAnim1, { top: 100, left: 50 }, 'star')}
      {renderFloatingElement(floatingAnim2, { top: 200, right: 30 }, 'heart')}
      {renderFloatingElement(floatingAnim3, { top: 300, left: 30 }, 'flash')}
      
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBackPress} style={styles.headerButton}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ravi</Text>
            <TouchableOpacity onPress={handleEditPress} style={styles.headerButton}>
              <Ionicons name="create-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Fixed Header Buttons */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={handleBackPress} style={styles.floatingHeaderButton}>
          <BlurView intensity={50} style={styles.buttonBlur}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEditPress} style={styles.floatingHeaderButton}>
          <BlurView intensity={50} style={styles.buttonBlur}>
            <Ionicons name="create-outline" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Full Screen Profile Image */}
        <Animated.View
          style={[
            styles.profileImageContainer,
            {
              transform: [{ translateY: parallaxImageTransform }],
              opacity: imageOpacity,
            },
          ]}
        >
          <Image
            source={{ uri: 'https://t3.ftcdn.net/jpg/04/19/88/96/360_F_419889684_ZcIYZWwxtns7Q469DcLVybs94GIHNHjm.jpg' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
         
        </Animated.View>

        {/* Content Container */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Animated.Text 
              style={[
                styles.name,
                {
                  transform: [{
                    scale: scrollY.interpolate({
                      inputRange: [0, 100],
                      outputRange: [1, 0.9],
                      extrapolate: 'clamp',
                    })
                  }]
                }
              ]}
            >
              Ravi
            </Animated.Text>
            <Text style={styles.role}>Business Owner</Text>
            <Text style={styles.location}>Chennai, Tamil nadu, India</Text>
          </View>

          {/* Social Icons Grid */}
          <View style={styles.socialContainer}>
            <Text style={styles.sectionTitle}>Connect with me</Text>
            <View style={styles.socialGrid}>
              {socialIcons.map((icon, index) => renderSocialIcon(icon, index))}
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            <LinearGradient
              colors={['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)'] as [string, string]}
              style={styles.ratingGradient}
            >
              <Text style={styles.ratingTitle}>About Me</Text>
              <Text style={styles.aboutText}>AI & ML enthusiast, CSE-AIML undergrad, passionate about building real-world tech solutions. Fast learner, focused, and driven to innovate.









</Text>
              
            </LinearGradient>
          </View>

          {/* Share Profile */}
                  <TouchableOpacity
                        style={styles.shareProfileButton}
                        onPress={handleShareProfile}
                        activeOpacity={0.8}
                      >
                        <View style={styles.shareProfileContent}>
                          <Ionicons name="share-outline" size={18} color="#F59E0B" />
                          <Text style={styles.shareProfileText}>Share Profile</Text>
                        </View>
                  </TouchableOpacity>

          {/* Extra spacing for scroll */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
shareProfileButton: {
  backgroundColor: "rgba(245, 158, 11, 0.1)",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "rgba(245, 158, 11, 0.3)",
  marginBottom: 24,
  width: 200,
  alignSelf: 'center',  // ✅ This line centers it horizontally
}
,
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
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: Platform.OS === 'ios' ? 100 : 80,
  },
  headerBlur: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  fixedHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 999,
  },
  floatingHeaderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  buttonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileImageContainer: {
    height: PROFILE_IMAGE_HEIGHT,
    width: width,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  contentContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    minHeight: height * 0.6,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  name: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  role: {
    fontSize: 20,
    color: '#F59E0B',
    marginBottom: 8,
    fontWeight: '600',
  },
  location: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  socialContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  socialIconContainer: {
    marginBottom: 20,
  },
  socialIconButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  socialIconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ratingGradient: {
    padding: 30,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  ratingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  aboutText: {
    fontSize: 16,
    color: '#F59E0B',
  },
  ratingCount: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfileLandingPage;