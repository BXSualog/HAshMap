import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

// Using the configuration from your New Alisto android project
const firebaseConfig = {
  apiKey: "AIzaSyCHcRN_1n3gpQAbuJ73rNDpuWJue1S_pBg",
  authDomain: "alistouser-database123.firebaseapp.com",
  projectId: "alistouser-database123",
  storageBucket: "alistouser-database123.firebasestorage.app",
  messagingSenderId: "40129169891",
  appId: "1:40129169891:android:550a952857a9f51e8ef8d6",
  databaseURL: "https://alistouser-database123-default-rtdb.firebaseio.com" // Standard mapping
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getDatabase(app);
export default app;
