// src/components/EmailAuth.tsx
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { invoke } from "@tauri-apps/api/core";

import { auth, db } from "../firebase";
import { useAuth } from "../context/auth-context";

interface User {
  email: string;
  createdAt: any;
  expiredAt: any;
  devices: string[];
  currentDevice: string;
}

const EmailAuth: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function getUserData(uid: string) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  }

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const today = new Date();
      today.setMonth(today.getMonth() + 1);
      today.setDate(today.getDate() + 1);
      console.log(today);
      // Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        expiredAt: today,
        devices: [],
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const currentDevice: string = await invoke("get_machine_uid");
        const _userData = await getUserData(user.uid);
        if (!_userData) return null;

        if(!_userData.devices.includes(currentDevice)) {
          // push to and save.
          // before push to, check the limit device
          // if reach limit, lock it
        }

        setUserData({
          email: _userData.email,
          createdAt: _userData.createdAt,
          expiredAt: _userData.expiredAt,
          devices: _userData.devices,
          currentDevice: currentDevice,
        });
      }
    };
    getUser();
  }, [user]);

  console.log(userData);
  return (
    <div className="border border-border p-4 rounded-3xl">
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
          <hr className="my-2" />
          {userData && <span>{JSON.stringify(userData)}</span>}
        </>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default EmailAuth;
