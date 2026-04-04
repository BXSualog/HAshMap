import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';

const AlistoForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent! Please check your email inbox.');
      setEmail('');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        default:
          setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a0c0e', '#111418']}
      style={styles.container}
    >
      <SafeAreaView style={styles.wrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#e8650a" />
            </TouchableOpacity>
            <Text style={styles.wordmark}>
              Alisto:<Text style={styles.accent}>Go</Text>
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardGlow} />
            <Text style={styles.cardTitle}>Reset Password</Text>
            <Text style={styles.cardSubtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#3d4654"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              {message ? (
                <View style={[styles.messageBox, styles.successBox]}>
                  <Text style={styles.successText}>{message}</Text>
                </View>
              ) : null}

              {error ? (
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>{error}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  brand: {
    marginBottom: 36,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e8e6e1',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  accent: {
    color: '#e8650a',
  },
  card: {
    backgroundColor: '#111418',
    borderRadius: 8,
    padding: 32,
    borderWidth: 1,
    borderColor: '#1e2530',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#e8650a',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e8e6e1',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#7a8494',
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7a8494',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#0a0c0e',
    borderWidth: 1,
    borderColor: '#1e2530',
    borderRadius: 4,
    padding: 12,
    color: '#e8e6e1',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#e8650a',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  messageBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: '#1e2530',
    borderRadius: 4,
  },
  successBox: {
    borderColor: '#28a745',
    backgroundColor: 'rgba(40, 167, 69, 0.05)',
  },
  messageText: {
    color: '#f44336',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  successText: {
    color: '#28a745',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#1e2530',
    alignItems: 'center',
  },
  linkText: {
    color: '#e8650a',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AlistoForgotPassword;
