import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Listen to Firebase Auth state ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          username: user.email,
        });
      } else {
        setCurrentUser(null);
        setPurchases([]);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Listen to Firestore purchases for current user ──
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'users', currentUser.uid, 'purchases'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPurchases(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [currentUser]);

  // ── AUTH ──────────────────────────────────────────────────────────
  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (err) {
      const msg =
        err.code === 'auth/user-not-found' ? 'No account found with this email.' :
          err.code === 'auth/wrong-password' ? 'Incorrect password.' :
            err.code === 'auth/invalid-email' ? 'Invalid email address.' :
              err.code === 'auth/invalid-credential' ? 'Incorrect email or password.' :
                'Login failed. Please try again.';
      return { ok: false, error: msg };
    }
  }

  async function register(name, email, password) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      return { ok: true };
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use' ? 'Email already registered.' :
          err.code === 'auth/invalid-email' ? 'Invalid email address.' :
            err.code === 'auth/weak-password' ? 'Password must be at least 6 characters.' :
              'Registration failed. Please try again.';
      return { ok: false, field: 'email', error: msg };
    }
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
    setPurchases([]);
  }

  // ── CRUD ──────────────────────────────────────────────────────────
  async function addPurchase(data) {
    if (!currentUser) return;
    await addDoc(collection(db, 'users', currentUser.uid, 'purchases'), {
      ...data,
      arrived: false,
      createdAt: new Date(),
    });
  }

  async function updatePurchase(id, data) {
    if (!currentUser) return;
    await updateDoc(doc(db, 'users', currentUser.uid, 'purchases', id), data);
  }

  async function deletePurchase(id) {
    if (!currentUser) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'purchases', id));
  }

  async function toggleStatus(id) {
    if (!currentUser) return;
    const purchase = purchases.find(p => p.id === id);
    if (!purchase) return;
    await updateDoc(doc(db, 'users', currentUser.uid, 'purchases', id), {
      arrived: !purchase.arrived,
    });
  }

  // ── STATS ─────────────────────────────────────────────────────────
  const totalSpent = purchases.reduce((s, p) => s + parseFloat(p.price || 0), 0);
  const arrivedCount = purchases.filter(p => p.arrived).length;
  const pendingCount = purchases.length - arrivedCount;

  return (
    <AppContext.Provider value={{
      currentUser, purchases, loading,
      totalSpent, arrivedCount, pendingCount,
      login, register, logout,
      addPurchase, updatePurchase, deletePurchase, toggleStatus,
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}