// Firebase 配置和初始化
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAufVyStM1-sgdTJsX6NdNeN9AeoCRIX6A",
  authDomain: "myclouddisk-710ef.firebaseapp.com",
  projectId: "myclouddisk-710ef",
  storageBucket: "myclouddisk-710ef.firebasestorage.app",
  messagingSenderId: "447065670060",
  appId: "1:447065670060:web:bd4745dd3ce9f63ceefa09",
  measurementId: "G-9HGZH94W2H"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Analytics (only in browser)
// 延迟初始化 Analytics，避免阻塞认证流程
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    // 使用 setTimeout 延迟初始化，避免阻塞
    setTimeout(() => {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn("Analytics initialization failed:", err);
      }
    }, 1000);
  } catch (err) {
    console.warn("Analytics setup failed:", err);
  }
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// App ID for Firestore collection structure
const appId = 'myclouddisk-710ef';

export { app, auth, db, appId, analytics };

