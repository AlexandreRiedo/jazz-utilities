"use client"
import { useEffect, useState } from "react";
import { mainRandomGenerate } from './_lib/chordUtils';
import NoteCheckboxGroup from './_components/NoteCheckboxGroup';
import ChordCheckboxGroup from './_components/ChordCheckboxGroup';
import { useMetronome } from './_lib/useMetronome';
import MetronomeControls from './_components/MetronomeControls';
import { getInitialFormOptions } from './_lib/storageUtils';
import SequenceCheckboxGroup from "./_components/SequenceCheckboxGroup";

export default function Home() {
  // The UI chords and tones, and also the random sequence
  const [chordList, setChordList] = useState([]);
  const [numberList, setNumberList] = useState([]);
  const [sequenceList, setSequenceList] = useState(["1", "2", "3", "4", "5", "6", "maj7"]);
  const [isMounted, setIsMounted] = useState(false);

  // Use the default options, or the one stored in local storage
  const [formOptions, setFormOptions] = useState(getInitialFormOptions)

  // Set mounted state after hydration to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Store in local storage on formOptions Changes
  // NB: Make sure that sets are converted to Arrays !
  useEffect(() => {
    const formOptionsArrayEdit = {
      ...formOptions,
      notePool: Array.from(formOptions.notePool),
      chordPool: Array.from(formOptions.chordPool),
      sequencePool: Array.from(formOptions.sequencePool),
    };
    localStorage.setItem("formOptionsStorage", JSON.stringify(formOptionsArrayEdit));
  }, [formOptions])

  // Random Generation
  function triggerRandomGeneration() {
    const resultGeneration = mainRandomGenerate(formOptions);
    setChordList(resultGeneration.chords);
    setNumberList(resultGeneration.targetTones);
  }

  // Metronome Stuff
  const { metronomeSettings, setMetronomeSettings, metronomeState, toggleMetronome } = useMetronome(triggerRandomGeneration);

  // Update Shown Notes Based On Changes in formOptions
  useEffect(() => {
    const resultGeneration = mainRandomGenerate(formOptions);
    setChordList(resultGeneration.chords);
    setNumberList(resultGeneration.targetTones);
  }, [formOptions.numberOfNotes, formOptions.notePool, formOptions.chordPool, formOptions.allowRootDuplication]);


  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-center">
        <main className="grid grid-rows-[1fr_auto] h-screen
      lg:w-full lg:flex lg:flex-col lg:justify-center lg:items-center lg:h-auto lg:overflow-x-clip">
          {/* Chord Display */}
          <section className="mt-12 relative self-center flex flex-col justify-center
        lg:w-230 xl:w-300 lg:mx-auto lg:mt-24">
            {/* Branding */}
            <header className="absolute z-20 top-[-5%] left-[50%] lg:left-[60%] px-8 py-2 lg:px-24 lg:py-2 text-lg lg:text-2xl border-3 font-semibold border-stone-950 font-neobrutalist text-white bg-stone-800 ">
              <span>Jazz Utilities 0.3</span>
            </header>

            {/* Decoration */}
            <div className="absolute w-40 lg:w-screen h-20 bg-red-400 lg:left-[10%] bottom-[20%]"></div>
            <div className="absolute w-40 lg:w-screen h-20 bg-pink-400 right-0 lg:right-[10%] bottom-[60%]"></div>
            <div className="absolute w-40 lg:w-screen h-30 bg-orange-400 lg:left-[10%] bottom-[50%]"></div>
            <div className="absolute w-40 lg:w-screen h-20 bg-lime-300 right-0 lg:right-[10%] bottom-20"></div>

            {/* Main Chord Card Display */}
            <section className="relative flex mx-4 px-4 py-12 text-stone-900 border-3 border-stone-900 bg-[#fff3f5] shadow-[8px_8px_var(--color-stone-900)]
            min-h-96 lg:min-h-[75vh] lg:pb-16">

              {/* Chord Grid */}
              <div className="grid grid-cols-2 gap-y-8 place-content-center flex-1
              sm:grid-cols-4
              lg:grid-cols-4 lg:gap-y-24">
                {chordList.map((chord, index) => {
                  return (
                    <output key={index} className="text-center font-neobrutalist font-[450] 
                text-4xl lg:text-6xl">
                      <span className="block text-center font-normal text-stone-600
                  text-3xl lg:text-4xl">
                        {numberList[index]}</span>
                      {chord}</output>

                  )
                })}
              </div>
            </section>
          </section>

          {/* Form Options */}
          <section className="
        lg:relative lg:bottom-[64px]
        lg:grid lg:grid-cols-[1fr_auto_auto] lg:gap-8 lg:items-start">

            {/* Randomize Button */}
            <div onClick={triggerRandomGeneration} className="relative flex flex-col justify-end py-8 w-full mt-8  px-4 border-y-0 border-[#7e4651] bg-[#ffa7b6]
          lg:my-0 lg:bg-transparent">
              <button className="px-8 py-2 bg-[#ff3859] border-2 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            hover:bg-[#ffa2b1] active:translate-2 active:shadow-none transition-all duration-75 cursor-pointer
            lg:mt-0">Randomize Chords!</button>
            </div>

            {/* Edit Metronome */}
            <div className="relative flex flex-col justify-end py-8 w-full px-4 border-y-0 border-[#7e4651] bg-[#ff95c5]
           lg:bg-transparent">
              <div className="bg-[#ff389c] border-2 border-b-0 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]">
                <details className="open:border-b-2">

                  {/* Button To Open */}
                  <summary className="px-8 py-2 text-center hover:bg-[#ff95ca] border-b-2 border-stone-900 cursor-pointer">Metronome</summary>

                  {/* Metronome Content */}
                  <div className="min-h-64 px-6 py-6 bg-[#ffcce5]">
                    <MetronomeControls
                      metronomeSettings={metronomeSettings}
                      setMetronomeSettings={setMetronomeSettings}
                      metronomeState={metronomeState}
                      toggleMetronome={toggleMetronome}
                    />
                  </div>
                </details>
              </div>
            </div>

            {/* Options */}
            <div className="relative flex flex-col justify-end py-8 px-4 border-y-0 border-[#7e4651] bg-[hsl(30,100%,89%)]
           lg:bg-transparent lg:w-auto">
              <div className="bg-[#ffc053] border-2 border-b-0 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            ">
                <details className="open:border-b-2">

                  {/* Button To Open */}
                  <summary className="px-8 py-2 text-center hover:bg-[hsl(30,100%,86%)] border-b-2 border-stone-900 cursor-pointer">Options</summary>

                  {/* Form Content */}
                  <div className="min-h-64 px-6 py-6  bg-[#fff7da]">
                    <form className="leading-0" onSubmit={e => e.preventDefault()}>
                      {/* Chord Option Section */}
                      <section>
                        <h1 className="mb-3 mt-4 font-medium text-4xl leading-8">Chord and Note Pool</h1>
                        {/* Number Of Notes */}
                        <label htmlFor="noteNumberInput" className="block font-normal text-xl text-stone-900">Number of Notes</label>
                        <input id="noteNumberInput" type="number" className="block w-full mb-8 px-4 py-1 border-2 border-[#574141] text-lg text-stone-700 bg-[hsl(29,100%,90%)] focus:outline-0 focus:border-[#FFC053]"
                          value={formOptions.numberOfNotes} onChange={e => {
                            setFormOptions({ ...formOptions, numberOfNotes: (parseInt(e.target.value) || 0) });
                          }}
                          min={1}></input>

                        {/* Note Pool */}
                        <label className="block font-normal text-xl text-stone-900">Note Pool</label>
                        {/* Sharp Keys */}
                        <NoteCheckboxGroup
                          notes={["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"]}
                          notePool={formOptions.notePool}
                          onNotePoolChange={newNotePool => setFormOptions({ ...formOptions, notePool: newNotePool })}
                        />
                        {/* White Keys */}
                        <NoteCheckboxGroup
                          notes={["C", "D", "E", "F", "G", "A", "B"]}
                          notePool={formOptions.notePool}
                          onNotePoolChange={newNotePool => setFormOptions({ ...formOptions, notePool: newNotePool })}
                        />
                        {/* Flat Keys */}
                        <NoteCheckboxGroup
                          notes={["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"]}
                          notePool={formOptions.notePool}
                          onNotePoolChange={newNotePool => setFormOptions({ ...formOptions, notePool: newNotePool })}
                        />

                        {/* Allow Root Duplication */}
                        <label htmlFor="allowRootDuplicationInput" className="mt-8 block font-normal text-xl text-stone-900">Allow root note duplicates</label>
                        <input id="allowRootDuplicationInput" type="checkbox" className="rootDuplication-checkbox"
                          checked={formOptions.allowRootDuplication}
                          onChange={e => setFormOptions({ ...formOptions, allowRootDuplication: e.target.checked })}
                        ></input>

                        {/* Chord Type Pool */}
                        <label className="block mt-8 font-normal text-xl text-stone-900">Chord Type Pool</label>
                        <div className="grid grid-cols-[1fr_1fr_3fr]">
                          {/* Simple Triads */}
                          <ChordCheckboxGroup
                            chords={[
                              { value: "", display: "maj" },
                              "m", "dim", "sus2", "sus4"
                            ]}
                            chordPool={formOptions.chordPool}
                            onChordPoolChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
                          />
                          {/* 7th Chords */}
                          <ChordCheckboxGroup
                            chords={["maj7", "m7", "m7b5", "7", "°7"]}
                            chordPool={formOptions.chordPool}
                            onChordPoolChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
                          />
                          {/* Advanced Chords */}
                          <ChordCheckboxGroup
                            chords={[
                              "6", "maj9", "maj13",
                              "m9", "m11", "m6",
                              "9", "13", "7sus4",
                              "alt", "7b9", "7#11",
                              "mMaj7", "13b9", "maj7#5"
                            ]}
                            chordPool={formOptions.chordPool}
                            onChordPoolChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
                            className="pl-4 grid grid-cols-3 auto-rows-min gap-y-2 mb-2"
                          />
                        </div>
                      </section>

                      {/* Random Sequence Options Section */}
                      <section>
                        <h1 className="mt-16 mb-3 font-medium text-4xl leading-8">Random Sequence</h1>

                        {/* Enable Random Sequence */}
                        <label htmlFor="enableRandomSequenceInput" className="block font-normal text-xl text-stone-900">Enable random sequence generation</label>
                        <input id="enableRandomSequenceInput" type="checkbox" className="rootDuplication-checkbox"
                          checked={formOptions.enableRandomSequence}
                          onChange={e => setFormOptions({ ...formOptions, enableRandomSequence: e.target.checked })}
                        ></input>

                        {/* Sequence Pool Selector */}
                        <label data-disabled={isMounted && !formOptions.enableRandomSequence} className="block mt-8 font-normal text-xl text-stone-900 data-[disabled=true]:opacity-40">Sequence Pool Selector</label>
                        <SequenceCheckboxGroup
                          sequences={["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "7", "maj7"]}
                          sequencePool={formOptions.sequencePool}
                          onSequencePoolChange={newSequencePool => setFormOptions({ ...formOptions, sequencePool: newSequencePool })}
                          disabled={isMounted && !formOptions.enableRandomSequence}
                        />
                      </section>

                    </form>
                  </div>
                </details>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
