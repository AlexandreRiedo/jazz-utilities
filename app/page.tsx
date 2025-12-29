"use client"
import { useState } from "react";
import { Chord } from "tonal";
import { Scale } from "tonal";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [chordList, setChordList] = useState(["D∆♯11", "E♭9"]);
  const [numberList, setNumberList] = useState(["maj7", "13"]);

  function generateRandomTargetTone(chordQuality: string) {
    // The form to select target tones will return a primitive extension list as shown below,
    // Each chord scale will just deviate from this base extension list.
    const allowedExtensionDegrees = ["1", "9", "3", "#11", "5", "13", "7"];

    switch (chordQuality) {
      case "7":
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      case "":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "4");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      case "6":
      case "maj7":
      case "maj9":
      case "maj7#11":
      case "maj13":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      case "m":
      case "m7":
      case "m9":
      case "m11":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      // Use locrian#2 by default
      case "m7b5":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1, "b5");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      default:
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];
    }
  }
  function mainRandomGenerate() {
    const notePool = ["C", "D", "E", "F", "G", "A", "B"];
    const chordQuality = ["", "m", "dim", "maj7", "m7", "m7b5", "7", "maj9"];
    const chordListLength = 2;
    const showNumberList = true;
    const chordListResult = [];
    const targetToneListResult = [];

    for (let i = 0; i < chordListLength; i++) {
      const note = notePool[Math.floor(Math.random() * notePool.length)];
      const extension = chordQuality[Math.floor(Math.random() * chordQuality.length)];
      const rawChord = note + extension;

      targetToneListResult.push(generateRandomTargetTone(extension));
      chordListResult.push(rawChord);
    }

    if (showNumberList) {
      setNumberList(targetToneListResult);
    } else {
      setNumberList([]);
    }
    setChordList(chordListResult);
  }

  return (
    <>
      <main className="grid grid-rows-[70fr_30fr] min-h-screen bg-rose-200 bg-[url('/svg/grid.svg')] bg-repeat bg-size-[80px_80px]">
        {/* Chord Display */}
        <div className="relative self-end flex flex-col justify-center">
          {/* Decoration */}
          <div className="absolute w-60 h-20 bg-red-400 bottom-[40%]"></div>
          <div className="absolute w-60 h-20 bg-pink-400 right-0 bottom-[80%]"></div>
          <div className="absolute w-20 h-30 bg-orange-400 left-[0%] bottom-[70%]"></div>
          <div className="absolute w-80 h-20 bg-lime-300 right-[0%] bottom-40"></div>

          {/* Main Chord Card Display */}
          <section className="relative flex flex-row flex-wrap items-center justify-center gap-8 gap-x-16 mx-4 p-4 min-h-96 text-stone-900 border-3 border-stone-900  bg-[#fff3f5] shadow-[8px_8px_var(--color-stone-900)]">
            {chordList.map((chord, index) => {
              return (
                <output key={uuidv4()} className="text-center font-neobrutalist font-[450] text-8xl">
                  <span key={uuidv4()} className="block text-center font-normal text-6xl text-stone-600">
                    {numberList[index]}</span>
                  {chord}</output>
              )
            })}
          </section>

          {/* Button Area */}
          <div className="relative flex justify-end py-8 w-full mt-16 px-4 border-y-0 border-[#7e4651] bg-[#ffa7b6]">
            <button onClick={mainRandomGenerate} className="px-8 py-2 bg-[#ff3859] border-2 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            hover:bg-[#d61c3b] active:translate-2 active:shadow-none transition-all duration-75 cursor-pointer">Randomize Chords!</button>
          </div>
        </div>

        {/* Form Options */}
        <div className="">
        </div>
      </main>
    </>
  );
}
