export const paluQuotes = [
  // English
  "Palu is where the mountains meet the sea, and every sunrise feels magical.",
  "In Central Sulawesi, Palu whispers stories of nature and resilience.",
  "Palu's sunsets are a reminder of life's simple beauty.",
  "Walking through Palu feels like stepping into the heart of Sulawesi.",
  "The waves of Palu’s beaches sing the songs of serenity.",
  "Palu is a hidden gem of Indonesia, full of culture and warmth.",
  "From mountains to coastlines, Palu paints nature’s perfect canvas.",
  "The spirit of Palu shines brighter than the morning sun.",
  "In Palu, every street has a story to tell.",
  "Palu’s charm lies in its people and breathtaking landscapes.",

  // Bahasa Indonesia
  "Palu adalah tempat pegunungan bertemu laut, dan setiap matahari terbit terasa ajaib.",
  "Di Sulawesi Tengah, Palu membisikkan kisah alam dan ketangguhan.",
  "Senja di Palu mengingatkan kita pada keindahan sederhana hidup.",
  "Berjalan di Palu seperti menjejak ke jantung Sulawesi.",
  "Ombak di pantai Palu menyanyikan lagu ketenangan.",
  "Palu adalah permata tersembunyi Indonesia, kaya budaya dan kehangatan.",
  "Dari gunung hingga pantai, Palu melukis kanvas alam yang sempurna.",
  "Semangat Palu bersinar lebih terang dari matahari pagi.",
  "Di Palu, setiap jalan memiliki cerita untuk diceritakan.",
  "Pesona Palu terletak pada penduduk dan lanskapnya yang menakjubkan."
];


import React, { useState, useEffect } from 'react';

export function FadingQuote({ interval = 4000, fadeDuration = 800, fontSize = "2rem", italic = true }) {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      // fade out
      setOpacity(0);

      // after fadeDuration, change text and fade in
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % paluQuotes.length);
        setOpacity(1);
      }, fadeDuration);

      return () => clearTimeout(timeout);
    }, interval);

    return () => clearInterval(timer);
  }, [interval, fadeDuration]);

  return (
    <p
      style={{
        opacity: opacity,
        transition: `opacity ${fadeDuration}ms ease-in-out`,
      }}
    ><i>
      "{paluQuotes[index]}"
    </i></p>
  );
}
