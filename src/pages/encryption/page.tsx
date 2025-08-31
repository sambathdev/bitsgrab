import { Input, ScrollArea, Separator } from "@/components/reactive-resume";
import { t } from "@lingui/core/macro";
import { motion } from "framer-motion";
import { MainPathSelector } from "@/features/video-downloader/main-path-selector";
import { useUiStore } from "@/stores";
import React, { useState, useCallback } from 'react';
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { encryptData, decryptData } from "@/services/common";
import { LockIcon, UnlockIcon, CopyIcon, CheckIcon, AlertTriangleIcon } from "@/components/icons";


const Encryption = () => {
  const [plainText, setPlainText] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [cipherText, setCipherText] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Decryption state
  const [cipherTextForDecrypt, setCipherTextForDecrypt] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // General state
  const [error, setError] = useState<string | null>(null);

  // Hooks for copying text
  const [copiedCipherText, copyCipherText] = useCopyToClipboard();
  const [copiedDecryptedText, copyDecryptedText] = useCopyToClipboard();

  const handleEncrypt = useCallback(async () => {
    if (!plainText || !encryptKey) {
      setError('Please provide both data to encrypt and an encryption key.');
      return;
    }
    setError(null);
    setIsEncrypting(true);
    setCipherText('');
    try {
      const encrypted = await encryptData(plainText, encryptKey);
      setCipherText(encrypted);
    } catch (e) {
      console.error(e);
      setError('Encryption failed. Please try again.');
    } finally {
      setIsEncrypting(false);
    }
  }, [plainText, encryptKey]);

  const handleDecrypt = useCallback(async () => {
    if (!cipherTextForDecrypt || !decryptKey) {
      setError('Please provide both ciphertext and a decryption key.');
      return;
    }
    setError(null);
    setIsDecrypting(true);
    setDecryptedText('');
    try {
      const decrypted = await decryptData(cipherTextForDecrypt, decryptKey);
      setDecryptedText(decrypted);
    } catch (e) {
      console.error(e);
      setError('Decryption failed. The key may be incorrect or the data may be corrupt.');
    } finally {
      setIsDecrypting(false);
    }
  }, [cipherTextForDecrypt, decryptKey]);

  return (
    <div className="flex flex-col items-center p-2">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          CryptoTextg
        </h1>
        <p className="text-slate-400 mt-2">Secure Browser-Based Encryption & Decryption</p>
      </header>

      {error && (
        <div className="w-full max-w-4xl bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center shadow-lg">
          <AlertTriangleIcon className="h-5 w-5 mr-3" />
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-300 hover:text-red-100">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ENCRYPTION CARD */}
        <div className="p-2 rounded-xl shadow-2xl border border-border">
          <h2 className="text-xl font-semibold mb-2 flex items-center text-cyan-400">
            <LockIcon className="h-4 w-4 mr-2" />
            Encrypt
          </h2>
          <div className="space-y-2">
            <textarea
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
              placeholder="Enter text to encrypt..."
              className="w-full h-32 p-3 border border-border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 resize-none"
            />
            <input
              type="password"
              value={encryptKey}
              onChange={(e) => setEncryptKey(e.target.value)}
              placeholder="Encryption Key"
              className="w-full p-1 px-2 border border-border rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
            />
            <button
              onClick={handleEncrypt}
              disabled={isEncrypting}
              className="w-full flex justify-center items-center p-1 px-2 font-bold border border-border hover:bg-cyan-500 rounded-md transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt Data'}
            </button>
            <div className="relative">
              <textarea
                value={cipherText}
                readOnly
                placeholder="Ciphertext will appear here..."
                className="w-full h-32 p-3 border border-border rounded-md resize-none font-mono text-sm pr-10"
              />
              {cipherText && (
                 <button onClick={() => copyCipherText(cipherText)} className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-600 rounded-md transition">
                   {copiedCipherText ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* DECRYPTION CARD */}
        <div className="p-2 rounded-xl shadow-2xl border border-border">
          <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-400">
            <UnlockIcon className="h-4 w-4 mr-2" />
            Decrypt
          </h2>
          <div className="space-y-2">
            <textarea
              value={cipherTextForDecrypt}
              onChange={(e) => setCipherTextForDecrypt(e.target.value)}
              placeholder="Paste ciphertext here..."
              className="w-full h-32 p-3 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none font-mono text-sm"
            />
            <input
              type="password"
              value={decryptKey}
              onChange={(e) => setDecryptKey(e.target.value)}
              placeholder="Decryption Key"
              className="w-full p-1 px-2 border border-border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
            <button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className="w-full flex justify-center items-center p-1 px-2 font-bold border border-border hover:bg-blue-500 rounded-md transition duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isDecrypting ? 'Decrypting...' : 'Decrypt Data'}
            </button>
            <div className="relative">
              <textarea
                value={decryptedText}
                readOnly
                placeholder="Decrypted text will appear here..."
                className="w-full h-32 p-3 border border-border rounded-md resize-none pr-10"
              />
               {decryptedText && (
                 <button onClick={() => copyDecryptedText(decryptedText)} className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-600 rounded-md transition">
                   {copiedDecryptedText ? <CheckIcon className="h-5 w-5 text-green-400" /> : <CopyIcon className="h-5 w-5" />}
                 </button>
              )}
            </div>
          </div>
        </div>
      </main>

       <footer className="w-full max-w-4xl text-center mt-10 text-slate-500 text-sm">
        {/* <p>All cryptographic operations are performed locally in your browser. No data is ever sent to a server.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} CryptoText. Using Web Crypto API (AES-GCM).</p> */}
      </footer>
    </div>
  );
};

export default Encryption;
