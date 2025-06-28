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
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native"
import { useAuth } from "../context/AuthContext"

const { width, height } = Dimensions.get("window")

export default function SignInScreen() {
  const { signIn, isAuthenticated, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))

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
  }, [fadeAnim, slideAnim])

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      if (user.is_profile_complete) {
        router.replace("/(tabs)/HomePage")
      } else {
        router.replace("/(tabs)/AddLinks")
      }
    }
  }, [isAuthenticated, user])

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      await signIn(email.toLowerCase().trim(), password)
      // Navigation will be handled by useEffect above
    } catch (error: any) {
      console.error('Sign in error:', error)
      Alert.alert("Sign In Failed", error.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    Alert.alert("Coming Soon", "Google sign in will be available soon!")
  }

  const handleFacebookSignIn = () => {
    Alert.alert("Coming Soon", "Facebook sign in will be available soon!")
  }

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality will be available soon!")
  }

  const handleSignUp = () => {
    router.push("/components/SignUp")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Logo Container */}
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <View style={styles.logoIcon}>
                    <Ionicons name="wifi" size={24} color="#F59E0B" />
                  </View>
                  <Text style={styles.logoText}>Tapzx</Text>
                </View>
              </View>

              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your Tapzx account</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#F59E0B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholderTextColor="#64748B"
                    editable={!isLoading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#F59E0B" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    placeholderTextColor="#64748B"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={10} color="#0F172A" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity 
                style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
                onPress={handleSignIn} 
                activeOpacity={0.9}
                disabled={isLoading}
              >
                <LinearGradient 
                  colors={isLoading ? ["#64748B", "#64748B"] : ["#F59E0B", "#FBBF24"]} 
                  style={styles.signInGradient}
                >
                  <Text style={styles.signInButtonText}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                  {!isLoading && <Ionicons name="arrow-forward" size={16} color="#0F172A" style={styles.arrowIcon} />}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Sign In Buttons */}
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} activeOpacity={0.8}>
                <Ionicons name="logo-google" size={18} color="#DB4437" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignIn} activeOpacity={0.8}>
                <Ionicons name="logo-facebook" size={18} color="#4267B2" />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>

              {/* Terms and Privacy */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>By signing in, you agree to our </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}> & </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    minHeight: height - 100,
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
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  logoIcon: {
    marginRight: 8,
    transform: [{ rotate: '45deg' }],
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    minHeight: 44,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
  },
  passwordInput: {
    paddingRight: 35,
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
  },
  signInButton: {
    marginBottom: 20,
    borderRadius: 14,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  signInGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    minHeight: 44,
  },
  signInButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#64748B",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    minHeight: 44,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  signUpText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  signUpLink: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  termsLink: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "500",
  },
})