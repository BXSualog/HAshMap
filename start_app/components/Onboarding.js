import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Alisto:Go',
    subtitle: 'Kampo Preparado: Kasama ang Alisto',
    buttonText: 'Get Started',
    buttonType: 'text',
    image: require('../assets/alisto-logo.png'),
    icon: 'weather-partly-cloudy',
    iconLibrary: 'MaterialCommunityIcons',
  },
  {
    id: 2,
    title: 'Live Weather Updates',
    subtitle: 'Get accurate, real-time forecasts anytime, anywhere.',
    buttonText: 'arrow', // Arrow type button fallback? Actually let's use standard text 'Next' for visual consistency, or if they asked for sun/cloud/rain animation, let's use it as icon.
    buttonType: 'text',
    buttonLabel: 'Next',
    image: require('../assets/weather-update.gif'),
    icon: 'weather-lightning-rainy',
    iconLibrary: 'MaterialCommunityIcons',
  },
  {
    id: 3,
    title: 'Location Permission',
    subtitle: 'Allow location access for accurate forecasts in your area.',
    buttonText: 'arrow',
    buttonType: 'arrow', // Special marker for an arrow icon
    image: require('../assets/location-pin.png'),
    icon: 'map-marker-radius',
    iconLibrary: 'MaterialCommunityIcons',
  },
  {
    id: 4,
    title: 'Alerts and Notifications',
    subtitle: 'Stay Safe with Alerts\nGet real-time alerts for storms, heat, floods.',
    buttonText: 'Allow Notifications',
    buttonType: 'text',
    image: require('../assets/notification-bell.png'),
    icon: 'bell-ring',
    iconLibrary: 'MaterialCommunityIcons',
  },
  {
    id: 5,
    title: 'Alisto:Go AI is now ready!',
    subtitle: 'Your weather assistant is now ready to help you stay prepared.',
    buttonText: 'Start Using App',
    buttonType: 'text',
    image: require('../assets/done-check.png'),
    icon: 'check-circle',
    iconLibrary: 'MaterialCommunityIcons',
  },
];

export default function Onboarding({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navigateToNextSlide = () => {
    if (currentIndex < SLIDES.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 150);
    } else {
      onComplete();
    }
  };

  const navigateToPreviousSlide = () => {
    if (currentIndex > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
      }, 150);
    }
  };

  const skipToDone = () => {
    setCurrentIndex(SLIDES.length - 1);
  };

  const currentSlide = SLIDES[currentIndex];

  const renderIcon = () => {
    if (currentSlide.image) {
      let scaleStyles = {};
      if (currentSlide.id === 3) {
        scaleStyles = { width: 360, height: 360, marginTop: 40, marginBottom: -15 };
      } else if (currentSlide.id === 4 || currentSlide.id === 5) {
        scaleStyles = { width: 360, height: 360, marginTop: 40, marginBottom: -25 };
      }

      return (
        <View style={[styles.imageContainer, scaleStyles]}>
          <Image source={currentSlide.image} style={styles.imageIcon} resizeMode="contain" />
        </View>
      );
    }
    const IconComponent = currentSlide.iconLibrary === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    return (
      <View style={styles.iconContainer}>
        <IconComponent name={currentSlide.icon} size={144} color="#3b82f6" />
      </View>
    );
  };

  const renderButton = () => {
    if (currentSlide.buttonType === 'arrow') {
      return (
        <TouchableOpacity style={styles.arrowButton} onPress={navigateToNextSlide}>
          <Ionicons name="arrow-forward" size={32} color="#fff" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.button} onPress={navigateToNextSlide}>
        <Text style={styles.buttonText}>{currentSlide.buttonLabel || currentSlide.buttonText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Back Button */}
      {currentIndex > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={navigateToPreviousSlide}>
          <Ionicons name="arrow-back" size={28} color="#1f5fffe7" />
        </TouchableOpacity>
      )}

      {/* Skip Button */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={skipToDone}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slide Content */}
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        {renderIcon()}
        <Text style={[
          styles.title,
          currentSlide.id === 1 && { fontSize: 30 },
          (currentSlide.id === 4 || currentSlide.id === 5) && { fontSize: 23 }
        ]}>{currentSlide.title}</Text>
        <Text style={[styles.subtitle, (currentSlide.id === 4 || currentSlide.id === 5) && { fontSize: 13 }]}>{currentSlide.subtitle}</Text>
      </Animated.View>

      {/* Footer / Buttons */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.buttonWrapper}>
          {renderButton()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbffff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    fontSize: 14,
    color: '#1f5fffe7',
    fontFamily: 'Montserrat_600SemiBold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  imageContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 70,
  },
  imageIcon: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 60,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Montserrat_700Bold',
    color: '#1c7effff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#ff8000ff',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  footer: {
    height: 180,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#3b82f6',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#d1d5db',
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  button: {
    backgroundColor: '#ff8000ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
  arrowButton: {
    backgroundColor: '#ff8000ff',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff8000ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
