"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { generate, count } from "random-words";
import StarIcon1 from "@/components/StarIcon1";
import StarIcon2 from "@/components/StarIcon2";

export default function Home() {
  const [character, setCharacter] = useState([]);
  const [levelWords, setLevelWords] = useState([]);
  const [completedWords, setCompletedWords] = useState([]);
  const [currentWordLetters, setCurrentWordLetters] = useState({
    letters: [],
    x: "",
  });
  const [currentLetterIndex, setCurrentLetterIndex] = useState(1);
  const [level, setLevel] = useState(1);
  const [colorFlag, setColorFlag] = useState(false);

  useEffect(() => {
    generateLevelWords(level);
  }, [level]);

  useEffect(() => {
    if (
      completedWords.length == levelWords.length &&
      completedWords.length != 0
    ) {
      setColorFlag(true);
      setTimeout(() => {
        setCompletedWords([]);
        setLevel((prev) => prev + 1);
        setCharacter([]);
      }, 1000);
      setTimeout(() => {
        setColorFlag(false);
      }, 1200);
    } else {
    }
  }, [completedWords, levelWords]);

  const generateLevelWords = (level) => {
    const levelWordsge = generate({
      minLength: level,
      maxLength: level + 2,
      exactly: 3,
    });
    setLevelWords([
      //`calc(47vw - ${levelWordsge[0].length + 10}vw)`
      //`calc(47vw + ${levelWordsge[2].length + 10}vw)`
      { word: levelWordsge[0], x: "20vw" },
      { word: levelWordsge[1], x: "47vw" },
      { word: levelWordsge[2], x: "74vw" },
    ]);
  };

  useEffect(() => {
    const typedCharacterHandler = (event) => {
      const pressedKey = event.key;
      let keyFound = false;
      if (currentWordLetters.letters.length != 0) {
        if (pressedKey === currentWordLetters.letters[currentLetterIndex]) {
          setCharacter((prev) => [
            ...prev,
            {
              letter: pressedKey,
              id: Math.random(),
              x: currentWordLetters.x,
            },
          ]);
          if (currentLetterIndex + 1 == currentWordLetters.letters.length) {
            setCurrentWordLetters({
              letters: [],
              x: "",
            });
            setCurrentLetterIndex(1);
            setCompletedWords((prev) => [
              ...prev,
              {
                word: currentWordLetters.letters.join(""),
                x: currentWordLetters.x,
              },
            ]);
          } else {
            setCurrentLetterIndex((prev) => prev + 1);
          }
        } else {
          setCharacter((prev) => [
            ...prev,
            {
              letter: pressedKey,
              id: Math.random(),
              x: `${Math.floor(Math.random() * 141) - 20}vw`,
              y: "-15vh",
            },
          ]);
        }
      } else {
        for (const letterObj of levelWords) {
          if (
            letterObj.word.startsWith(pressedKey) &&
            !completedWords.some(
              (completedWord) => completedWord.word === letterObj.word
            )
          ) {
            setCharacter((prev) => [
              ...prev,
              {
                letter: pressedKey,
                id: Math.random(),
                x: letterObj.x,
              },
            ]);
            keyFound = true;
            setCurrentWordLetters({
              letters: letterObj.word.split(""),
              x: letterObj.x,
            });
            break;
          }
        }

        if (!keyFound) {
          setCharacter((prev) => [
            ...prev,
            {
              letter: pressedKey,
              id: Math.random(),
              x: `${Math.floor(Math.random() * 141) - 20}vw`,
              y: "-15vh",
            },
          ]);
        }
      }
    };
    document.addEventListener("keydown", typedCharacterHandler);

    return () => {
      document.removeEventListener("keydown", typedCharacterHandler);
    };
  }, [levelWords, currentWordLetters, currentLetterIndex, level]);

  return (
    <div className="fixed w-full min-h-screen bg-[#0a0923]">
      <StarIcon2 className="fixed fill-white w-32 h-32 z-10 left-24 top-24 mix-blend-soft-light" />
      <StarIcon2 className="fixed fill-white w-72 h-72 z-10 right-0 top-52 mix-blend-soft-light" />
      <StarIcon2 className="fixed fill-white w-96 h-96 z-10 left-[300px] -bottom-14 mix-blend-soft-light" />
      <StarIcon1 className="fixed fill-white w-32 h-32 z-10 left-[700px] bottom-64 mix-blend-soft-light" />

      <div className="relative w-full min-h-screen h-full select-none overflow-hidden">
        {levelWords.map(
          (item, index) => (
            console.log(
              `to-${
                Math.floor(
                  (1 - (currentLetterIndex - 1) / item.word.split("").length) *
                    100
                ) + "%"
              }`
            ),
            (
              <motion.div
                key={index}
                className={`bg-[#ffff] text-[#000] absolute transform -translate-x-1/2 w-fit px-4 py-2 border-2 z-30 border-[#4A5568] text-xl rounded-sm shadow-md`}
                initial={{
                  y: "15vh",
                  x: item.x,
                  color: "#000",
                  backgroundColor: "#ffff",
                }}
                animate={{
                  backgroundColor: completedWords.some(
                    (completedWord) => completedWord.word === item.word
                  )
                    ? "#C6F6D5"
                    : "#ffff",
                  color: completedWords.some(
                    (completedWord) => completedWord.word === item.word
                  )
                    ? "#4A9C57"
                    : "#000",
                  borderColor: completedWords.some(
                    (completedWord) => completedWord.word === item.word
                  )
                    ? "#4A9C57"
                    : "#4A5568",
                }}
                transition={{
                  duration: 0.1,
                  delay: colorFlag ? 0.1 : 0.8,
                }}
              >
                {item.word.toUpperCase()}
              </motion.div>
            )
          )
        )}
        {character.map((item) => (
          <motion.div
            key={item.id}
            className="absolute transform -translate-x-1/2 z-20 text-white font-medium text-lg"
            initial={{ x: "49vw", y: "95vh" }}
            animate={{ y: item.y || "15vh", x: `calc(${item.x} + 10px)` }}
            transition={{ duration: 1, type: "tween" }}
          >
            {item.letter.toUpperCase()}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
