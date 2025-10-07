// src/greetings.js
export const greetings = [
  "WELCOME",         // English
  "BIENVENUE",       // French
  "WILLKOMMEN",      // German
  "BIENVENIDO",      // Spanish
  "BENVENUTO",       // Italian
  "WELKOM",          // Dutch
  "欢迎",            // Chinese
  "ようこそ",         // Japanese
  "환영합니다",       // Korean
  //"ДОБРОПОЖАЛОВАТЬ",// Russian (Terlalu Panjang)
  "مرحبا",           // Arabic
  "SELAMAT DATANG",  // Indonesian / Malay
  "CHÀO MỪNG",       // Vietnamese
  "स्वागत है",        // Hindi
  "ยินดีต้อนรับ",     // Thai
  "MERHABA",         // Turkish
  "ALOHA",           // Hawaiian
  "KARIBU",          // Swahili
  "MABUHAY",         // Filipino / Tagalog
  "DOBRODOŠLI",      // Slovenian / Croatian
  "ΚΑΛΩΣ ΗΡΘΑΤΕ",     // Greek
  "VELKOMIN",        // Icelandic
  "WITAM",           // Polish
  "VÍTEJTE",         // Czech
  "BINE AȚI VENIT",  // Romanian
  "FÁILTE",          // Irish
  "CROESO",          // Welsh
  "LABAS",           // Lithuanian
  "SVEIKI",          // Latvian
  "BULA",            // Fijian
  "KIA ORA",         // Maori
  "SAWUBONA",        // Zulu
  "DUMELA",          // Tswana
  "TASHI DELEK",     // Tibetan
  "MERHBA",          // Maltese
  "BENVINGUT",       // Catalan
  "GODDAG",          // Danish
  "HEJ",             // Swedish / Danish
  "HEI",             // Norwegian / Finnish
  "AHLAAN"           // Arabic (informal)
];

import React, { useState, useEffect } from 'react';
import './App.css';

export function TypingGreeting({ typingSpeed = 100, deletingSpeed = 50, pause = 1000 }) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    Math.floor(Math.random() * greetings.length)
  );

  useEffect(() => {
    const currentText = greetings[currentIndex];
    let timeout;

    if (!isDeleting && displayText.length < currentText.length) {
      // typing
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, typingSpeed);
    } else if (isDeleting && displayText.length > 0) {
      // deleting
      timeout = setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      }, deletingSpeed);
    } else if (!isDeleting && displayText.length === currentText.length) {
      // finished typing, start deleting after pause
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayText.length === 0) {
      // finished deleting, pick a new random greeting
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * greetings.length);
      } while (nextIndex === currentIndex); // avoid repeating same text
      setCurrentIndex(nextIndex);
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, typingSpeed, deletingSpeed, pause]);

  return (
    <span>
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
}