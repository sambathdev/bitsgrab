// src/components/EmailAuth.tsx
import React, { memo, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";

import { auth, db } from "../firebase";
import { useAuth } from "../context/auth-context";

interface User {
  email: string;
  createdAt: any;
  expiredAt: any;
  devices: string[];
  currentDevice: string;
}

const EmailAuth = () => {
  const { user } = useAuth();
  const [currentDevice, setCurrentDevice] = useState<string | null>(null);
  const [allowSignUp, setAllowSignUp] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [apiTime, setApiTime] = useState<Date | null>(null);

  const runOnceToGetTime = useRef(false);
  if (runOnceToGetTime.current == false) {
    const getaTime = async () => {
      const __apiTime: any = await invoke("get_api_time");
      const _apiTime = new Date(__apiTime);
      setApiTime(_apiTime);
    };
    getaTime();
    runOnceToGetTime.current = true;
  }

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

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, `${email}@bits.com`, password);
      setError(null);
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        `${email}@bits.com`,
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
        devices: currentDevice ? [currentDevice] : [],
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  useEffect(() => {
    const getCurrentDevice = async () => {
      const _currentDevice: string = await invoke("get_machine_uid");
      setCurrentDevice(_currentDevice);
    };
    getCurrentDevice();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (user) {
        const _userData = await getUserData(user.uid);
        if (!_userData || !currentDevice) return null;

        if (!_userData.devices.includes(currentDevice)) {
          if (_userData.devices.length >= 3) {
            toast.error("Oops, Cannot login to another device.");
          } else {
            await setDoc(
              doc(db, "users", user.uid),
              {
                devices: [..._userData.devices, currentDevice],
              },
              { merge: true }
            );
            toast.success("Login Success", {
              description: "New Device Active.",
            });
          }
        } else {
          toast.success("Login Success");
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
  }, [currentDevice, user]);

  useEffect(() => {
    if (apiTime && userData && apiTime < userData.expiredAt.toDate()) {
      window.dispatchEvent(new CustomEvent("unlock", {}));
    } else {
      window.dispatchEvent(new CustomEvent("lock", {}));
    }
  }, [apiTime, userData]);

  return (
    <>
      <hr className="mb-2" />
      {!user && <h1 className="underline">Login</h1>}
      <div className="rounded">
        {userData ? (
          <>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <span className="text-xs h-[15px]">Email</span>
                <span className="text-xs h-[15px]">Expired</span>
                <span className="text-xs h-[15px]">Device</span>
                <span className="text-xs">Devices</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs h-[15px]">{userData.email}</span>
                <span className="text-xs h-[15px]">
                  {userData.expiredAt.toDate().toLocaleString()}
                </span>
                <span className="text-[7px] pt-[2px] h-[15px]">
                  {userData.currentDevice}
                </span>
                <span className="text-[7px] pt-[2px] flex flex-col">
                  {userData.devices.map((d) => (
                    <span key={d} className="text-[7px]">
                      {d}
                    </span>
                  ))}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                className="text-sm border-border border px-1 rounded mt-2"
                onClick={handleLogout}
              >
                Logout
              </button>
              {apiTime && apiTime > userData.expiredAt.toDate() && (
                <span>Expired</span>
              )}
            </div>
          </>
        ) : (
          <div>
            <input
              className="text-sm border border-border px-1 w-full"
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => {
                if (e.target.value == "iamyouradmin") {
                  setAllowSignUp(true);
                }
                setEmail(e.target.value);
              }}
            />
            <input
              className="text-sm border border-border px-1 w-full"
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="border border-border px-1 rounded mt-1 hover:bg-slate-700/50"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            {allowSignUp && (
              <button
                className="border border-border px-1 rounded mt-1 hover:bg-slate-700/50 ml-2"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            )}
            {error && (
              <p style={{ color: "red" }} className="text-sm">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(EmailAuth);
