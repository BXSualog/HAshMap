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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const AlistoSignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    console.log('Sign Up attempted with:', email);
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('user already exists');
          break;
        case 'auth/weak-password':
          setError('password is too weak (min. 6 characters)');
          break;
        case 'auth/invalid-email':
          setError('invalid email address');
          break;
        case 'auth/operation-not-allowed':
          setError('sign up is currently disabled');
          break;
        default:
          setError(`Error: ${err.message}`);
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
            <Text style={styles.wordmark}>
              Alisto:<Text style={styles.accent}>Go</Text>
            </Text>
            <View style={styles.alertStrip}>
              <View style={styles.dot} />
              <Text style={styles.alertText}>Account Registry</Text>
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardGlow} />
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSubtitle}>Join us to start managing your data.</Text>

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

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, { paddingRight: 45 }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#3d4654"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    style={styles.togglePassword}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={showPassword ? '#e8650a' : '#7a8494'}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repeat your password"
                  placeholderTextColor="#3d4654"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>

              {error ? (
                <View style={styles.messageBox}>
                  <Text style={styles.messageText}>{error}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  brand: { marginBottom: 36 },
  wordmark: { fontSize: 32, fontWeight: 'bold', color: '#e8e6e1', letterSpacing: 2, textTransform: 'uppercase' },
  accent: { color: '#e8650a' },
  alertStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 101, 10, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#e8650a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderRadius: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e8650a', marginRight: 8 },
  alertText: { color: '#e8650a', fontSize: 10, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  card: { backgroundColor: '#111418', borderRadius: 8, padding: 32, borderWidth: 1, borderColor: '#1e2530', position: 'relative', overflow: 'hidden' },
  cardGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: '#e8650a' },
  cardTitle: { fontSize: 22, fontWeight: '700', color: '#e8e6e1', letterSpacing: 1, textTransform: 'uppercase' },
  cardSubtitle: { fontSize: 13, color: '#7a8494', marginTop: 4, marginBottom: 28 },
  form: { gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 10, fontWeight: '700', color: '#7a8494', letterSpacing: 1.5, textTransform: 'uppercase' },
  input: { backgroundColor: '#0a0c0e', borderWidth: 1, borderColor: '#1e2530', borderRadius: 4, padding: 12, color: '#e8e6e1', fontSize: 14 },
  passwordWrapper: { position: 'relative' },
  togglePassword: { position: 'absolute', right: 12, top: 12 },
  button: { backgroundColor: '#e8650a', padding: 14, borderRadius: 4, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  messageBox: { marginTop: 14, padding: 12, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: '#1e2530', borderRadius: 4 },
  messageText: { color: '#7a8494', fontSize: 12, letterSpacing: 0.5 },
  footer: { marginTop: 22, paddingTop: 18, borderTopWidth: 1, borderTopColor: '#1e2530', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { color: '#7a8494', fontSize: 12 },
  linkText: { color: '#e8650a', fontSize: 12, fontWeight: '600' },
});

export default AlistoSignUp;
