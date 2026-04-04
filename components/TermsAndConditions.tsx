import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface TermsProps {
  onAccept: () => void;
}

export default function TermsAndConditions({ onAccept }: TermsProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-check" size={48} color="#1c7effff" />
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <Text style={styles.headerSubtitle}>Please review before using Alisto:Go</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="#ff8000ff" />
            <Text style={styles.sectionTitle}>Location Disclosure</Text>
          </View>
          <Text style={styles.sectionText}>
            Alisto:Go collects and uses your location data to provide real-time, localized typhoon alerts, heat index monitoring, and accurate weather forecasts. This data is used even when the app is in the background to ensure you receive critical safety notifications in a timely manner.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="robot" size={24} color="#ff8000ff" />
            <Text style={styles.sectionTitle}>AI Interaction & Data</Text>
          </View>
          <Text style={styles.sectionText}>
            Our Alisto AI assistant is designed to help you stay prepared. To improve our services and ensure safety compliance, your interactions and prompts with the AI are recorded and stored in our database. We do not sell this data to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="security" size={24} color="#ff8000ff" />
            <Text style={styles.sectionTitle}>Your Privacy</Text>
          </View>
          <Text style={styles.sectionText}>
            We are committed to protecting your privacy. By using this application, you acknowledge and agree to our data collection practices as described above. You can manage your location permissions at any time through your device settings.
          </Text>
        </View>

        <Text style={styles.footerNote}>
          By clicking 'I Agree and Continue', you confirm that you have read and understood these terms and grant permission for the specified data collection.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onAccept}>
          <Text style={styles.buttonText}>I Agree and Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbffff',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#1c7effff',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#64748b',
    marginTop: 5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#0f172a',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 15,
    fontFamily: 'Montserrat_400Regular',
    color: '#475569',
    lineHeight: 24,
  },
  footerNote: {
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  button: {
    backgroundColor: '#ff8000ff',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#ff8000ff',
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
});
