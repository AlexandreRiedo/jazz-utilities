"use client"
import { useEffect, useState } from "react";
import { Chord, note } from "tonal";
import { Scale } from "tonal";
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [chordList, setChordList] = useState(["D∆♯11", "E♭9"]);
  const [numberList, setNumberList] = useState(["maj7", "13"]);

  // const [numberOfNotes, setNumberOfNotes] = useState(2);
  const [formOptions, setFormOptions] = useState({
    numberOfNotes: 2,
    notePool: new Set(["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"])
  })

  function generateRandomTargetTone(chordQuality: string) {
    // The form to select target tones will return a primitive extension list as shown below,
    // Each chord scale will just deviate from this base extension list.
    const allowedExtensionDegrees = ["1", "9", "3", "#11", "5", "13", "7"];

    switch (chordQuality) {
      case "7":
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      case "":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "4");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "6");
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

      case "dim":
      case "°7":
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("3"), 1, "b3");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("#11"), 1, "11");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("5"), 1, "b5");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("13"), 1, "b13");
        allowedExtensionDegrees.push("13");
        allowedExtensionDegrees.splice(allowedExtensionDegrees.indexOf("7"), 1, "maj7");
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];

      default:
        return allowedExtensionDegrees[Math.floor(Math.random() * allowedExtensionDegrees.length)];
    }
  }

  function mainRandomGenerate({ numberOfNotes, notePool }: { numberOfNotes: number, notePool: Set<string> }) {
    const notePoolArray = Array.from(notePool);
    const chordQuality = ["", "m", "dim", "maj7", "m7", "m7b5", "7", "°7", "maj9"];
    const showNumberList = true;
    const chordListResult = [];
    const targetToneListResult = [];

    for (let i = 0; i < numberOfNotes; i++) {
      const note = notePoolArray[Math.floor(Math.random() * notePoolArray.length)];
      const extension = chordQuality[Math.floor(Math.random() * chordQuality.length)];
      const rawChord = note + extension;

      targetToneListResult.push(generateRandomTargetTone(extension));
      chordListResult.push(rawChord);
    }

    if (showNumberList) {
      return { chords: chordListResult, targetTones: targetToneListResult };
    } else {
      return { chords: chordListResult, targetTones: [] };
    }
  }

  function handlePressRandomButton() {
    const resultGeneration = mainRandomGenerate(formOptions);
    setChordList(resultGeneration.chords);
    setNumberList(resultGeneration.targetTones);
  }

  // Update Shown Notes Based On Changes in formOptions
  useEffect(() => {
    const resultGeneration = mainRandomGenerate(formOptions);
    setChordList(resultGeneration.chords);
    setNumberList(resultGeneration.targetTones);
  }, [formOptions.numberOfNotes, formOptions.notePool]);

  return (
    <>
      <main className="grid grid-rows-[1fr_auto] h-screen
      lg:grid-rows-[1fr_auto] lg:h-auto">
        {/* Chord Display */}
        <section className="mt-8 relative self-end flex flex-col justify-center
        lg:min-w-300 lg:mx-auto">
          {/* Decoration */}
          <div className="absolute w-40 lg:w-screen h-20 bg-red-400 lg:left-[10%] bottom-[20%]"></div>
          <div className="absolute w-40 lg:w-screen h-20 bg-pink-400 right-0 lg:right-[10%] bottom-[60%]"></div>
          <div className="absolute w-40 lg:w-screen h-30 bg-orange-400 lg:left-[10%] bottom-[50%]"></div>
          <div className="absolute w-40 lg:w-screen h-20 bg-lime-300 right-0 lg:right-[10%] bottom-20"></div>

          {/* Main Chord Card Display */}
          <div className="relative flex flex-row flex-wrap items-center justify-center gap-8 gap-x-16 mx-4 p-4 min-h-96 text-stone-900 border-3 border-stone-900  bg-[#fff3f5] shadow-[8px_8px_var(--color-stone-900)]">
            {chordList.map((chord, index) => {
              return (
                <output key={index} className="text-center font-neobrutalist font-[450] text-8xl">
                  <span className="block text-center font-normal text-6xl text-stone-600">
                    {numberList[index]}</span>
                  {chord}</output>
              )
            })}
          </div>
        </section>

        {/* Form Options */}
        <section className="
        lg:grid lg:grid-cols-3">

          {/* Randomize Button */}
          <div onClick={handlePressRandomButton} className="relative flex flex-col justify-end py-8 w-full mt-16 px-4 border-y-0 border-[#7e4651] bg-[#ffa7b6]
          lg:my-0">
            <button className="px-8 py-2 bg-[#ff3859] border-2 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            hover:bg-[#ffa2b1] active:translate-2 active:shadow-none transition-all duration-75 cursor-pointer
            lg:mt-0">Randomize Chords!</button>
          </div>

          {/* Edit Metronome */}
          <div className="relative flex flex-col justify-end py-8 w-full px-4 border-y-0 border-[#7e4651] bg-[#ff95c5]">
            <button className="px-8 py-2 bg-[#ff389c] border-2 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            hover:bg-[#ff95ca] active:translate-2 active:shadow-none transition-all duration-75 cursor-pointer
            ">Metronome</button>
          </div>

          {/* Options */}
          <div className="relative flex flex-col justify-end py-8 w-full px-4 border-y-0 border-[#7e4651] bg-[hsl(30,100%,89%)]">
            <div className=" bg-[#ffc053] border-2 border-b-0 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            ">
              <details open className="open:border-b-2">

                {/* Button To Open */}
                <summary className="w-full px-8 py-2 text-center hover:bg-[hsl(30,100%,86%)] border-b-2 border-stone-900 cursor-pointer">Options</summary>

                {/* Form Content */}
                <div className="min-h-64 px-6 py-6  bg-[#fff7da]">
                  <form className="leading-0" onSubmit={e => e.preventDefault()}>
                    {/* Number Of Notes */}
                    <label htmlFor="noteNumberInput" className="font-normal text-xl text-stone-900">Number of Notes</label>
                    <input id="noteNumberInput" type="number" className="w-full mb-8 px-4 py-1 border-2 border-[#574141] text-lg text-stone-700 bg-[hsl(29,100%,90%)] focus:outline-0 focus:border-[#FFC053]"
                      value={formOptions.numberOfNotes} onChange={e => {
                        setFormOptions({ ...formOptions, numberOfNotes: (parseInt(e.target.value) || 0) });
                      }}
                      min={1}></input>

                    {/* Note Pool */}
                    <label className="block font-normal text-xl text-stone-900">Note Pool</label>
                    {/* Sharp Keys */}
                    <fieldset className="flex flex-row gap-2 mb-2">
                      {["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"].map(item => {
                        return (
                          <label key={item} className="note-label">
                            <span>{item}</span>
                            <input type="checkbox" value={item}
                              checked={formOptions.notePool.has(item)}
                              onChange={e => {
                                const newNotePool = new Set(formOptions.notePool);
                                if (e.target.checked) {
                                  newNotePool.add(e.target.value);
                                } else {
                                  newNotePool.delete(e.target.value);
                                }
                                setFormOptions({ ...formOptions, notePool: newNotePool });
                              }}
                              className="note-checkbox" />
                          </label>
                        )
                      })
                      }
                    </fieldset>

                    {/* White Keys */}
                    <fieldset className="flex flex-row gap-2 my-2">
                      {["C", "D", "E", "F", "G", "A", "B"].map(item => {
                        return (
                          <label key={item} className="note-label">
                            <span>{item}</span>
                            <input type="checkbox" value={item}
                              checked={formOptions.notePool.has(item)}
                              onChange={e => {
                                const newNotePool = new Set(formOptions.notePool);
                                if (e.target.checked) {
                                  newNotePool.add(e.target.value);
                                } else {
                                  newNotePool.delete(e.target.value);
                                }
                                setFormOptions({ ...formOptions, notePool: newNotePool });
                              }}
                              className="note-checkbox" />
                          </label>
                        )
                      })
                      }
                    </fieldset>

                    {/* Flat Keys */}
                    <fieldset className="flex flex-row gap-2 my-2">
                      {["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"].map(item => {
                        return (
                          <label key={item} className="note-label">
                            <span>{item}</span>
                            <input type="checkbox" value={item}
                              checked={formOptions.notePool.has(item)}
                              onChange={e => {
                                const newNotePool = new Set(formOptions.notePool);
                                if (e.target.checked) {
                                  newNotePool.add(e.target.value);
                                } else {
                                  newNotePool.delete(e.target.value);
                                }
                                setFormOptions({ ...formOptions, notePool: newNotePool });
                              }}
                              className="note-checkbox" />
                          </label>
                        )
                      })
                      }
                    </fieldset>

                  </form>
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
