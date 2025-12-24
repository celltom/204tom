// Firebase 配置和初始化
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATS8YGzMcuBMEumNsNLgj7jMmCU7tfzKY",
  authDomain: "myclouddisk-5da65.firebaseapp.com",
  projectId: "myclouddisk-5da65",
  storageBucket: "myclouddisk-5da65.firebasestorage.app",
  messagingSenderId: "266411094712",
  appId: "1:266411094712:web:64e7e8db468ffba77e3a4d",
  measurementId: "G-DYLWFM3NX4"
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
const appId = 'myclouddisk-5da65';

export { app, auth, db, appId, analytics };

