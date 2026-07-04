import { Fragment } from 'react';
import CheckboxGroup from './CheckboxGroup';
import { FormOptions, getDefaultFormOptions, saveFormOptions, loadFormOptions } from '../_lib/formOptions';

interface OptionsFormProps {
  formOptions: FormOptions;
  setFormOptions: (options: FormOptions) => void;
  isMounted: boolean;
}

export default function OptionsForm({ formOptions, setFormOptions, isMounted }: OptionsFormProps) {

  // Save/Load handlers for 3 presets
  function handleSavePreset(presetKey: string) {
    try {
      saveFormOptions(presetKey, formOptions);
    } catch {
      alert('Failed to save preset.');
    }
  }
  function handleLoadPreset(presetKey: string) {
    try {
      const preset = loadFormOptions(presetKey);
      if (preset) setFormOptions(preset);
    } catch {
      alert('Failed to load preset.');
    }
  }

  return (
    <form className="leading-0" onSubmit={e => e.preventDefault()}>
      {/* Chord Option Section */}
      <section>
        <h1 className="mb-3 mt-4 font-medium text-4xl leading-8">Chord and Note Pool</h1>
        {/* Number Of Notes */}
        <label htmlFor="noteNumberInput" className="block font-normal text-xl text-stone-900">Number of Notes</label>
        <input id="noteNumberInput" type="number" className="block w-full mb-8 px-4 py-1 border-2 border-[#574141] text-lg text-stone-700 bg-[hsl(29,100%,90%)] focus:outline-0 focus:border-[#FFC053]"
          value={formOptions.numberOfNotes || ''}
          onChange={e => {
            const val = parseInt(e.target.value) || 0;
            setFormOptions({ ...formOptions, numberOfNotes: val });
          }}
          onBlur={() => {
            if (!formOptions.numberOfNotes || formOptions.numberOfNotes < 1) {
              setFormOptions({ ...formOptions, numberOfNotes: 1 });
            }
          }}
          min={1}></input>

        {/* Note Pool: sharp, white, and flat keys */}
        <label className="block font-normal text-xl text-stone-900">Note Pool</label>
        {[
          ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"],
          ["C", "D", "E", "F", "G", "A", "B"],
          ["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"],
        ].map((noteRow, index) => (
          <CheckboxGroup
            key={index}
            items={noteRow}
            selected={formOptions.notePool}
            onChange={newNotePool => setFormOptions({ ...formOptions, notePool: newNotePool })}
            className="flex flex-row justify-between gap-2 my-2"
          />
        ))}

        {/* Allow Root Duplication */}
        <label htmlFor="allowRootDuplicationInput" className="mt-8 block font-normal text-xl text-stone-900">Allow root note duplicates</label>
        <input id="allowRootDuplicationInput" type="checkbox" className="rootDuplication-checkbox"
          checked={formOptions.allowRootDuplication}
          onChange={e => setFormOptions({ ...formOptions, allowRootDuplication: e.target.checked })}
        ></input>

        {/* Show Guide Tone Display */}
        <label htmlFor="guideToneDisplayInput" className="mt-4 block font-normal text-xl text-stone-900">Show guide tone display</label>
        <input id="guideToneDisplayInput" type="checkbox" className="rootDuplication-checkbox"
          checked={formOptions.showGuideToneDisplay}
          onChange={e => setFormOptions({ ...formOptions, showGuideToneDisplay: e.target.checked })}
        ></input>

        {/* Chord Type Pool */}
        <label className="block mt-8 font-normal text-xl text-stone-900">Chord Type Pool</label>
        <div className="grid grid-cols-[1fr_1fr_3fr]">
          {/* Simple Triads */}
          <CheckboxGroup
            items={[
              { value: "", display: "maj" },
              "m", "dim", "sus2", "sus4"
            ]}
            selected={formOptions.chordPool}
            onChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
            className="flex flex-col gap-2 mb-2"
          />
          {/* 7th Chords */}
          <CheckboxGroup
            items={["maj7", "m7", "m7b5", "7", "°7"]}
            selected={formOptions.chordPool}
            onChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
            className="flex flex-col gap-2 mb-2"
          />
          {/* Advanced Chords */}
          <CheckboxGroup
            items={[
              "6", "maj9", "maj13",
              "m9", "m11", "m6",
              "9", "13", "7sus4",
              "alt", "7b9", "7#11",
              "mMaj7", "13b9", "maj7#5"
            ]}
            selected={formOptions.chordPool}
            onChange={newChordPool => setFormOptions({ ...formOptions, chordPool: newChordPool })}
            className="pl-4 grid grid-cols-3 auto-rows-min gap-y-2 mb-2"
          />
        </div>
      </section>

      {/* Random Sequence Options Section */}
      <section>
        <h1 className="mt-16 mb-3 font-medium text-4xl leading-8">Random Sequence</h1>

        {/* Enable Random Sequence */}
        <label htmlFor="enableRandomSequenceInput" className="not-sm:mb-2 block font-normal text-xl text-stone-900 leading-6">Enable random Sequence</label>
        <input id="enableRandomSequenceInput" type="checkbox" className="rootDuplication-checkbox"
          checked={formOptions.enableRandomSequence}
          onChange={e => setFormOptions({ ...formOptions, enableRandomSequence: e.target.checked })}
        ></input>

        {/* Sequence Pool Selector */}
        <label data-disabled={isMounted && !formOptions.enableRandomSequence} className="block mt-8 font-normal text-xl text-stone-900 data-[disabled=true]:opacity-40">Sequence Pool Selector</label>
        <CheckboxGroup
          items={["1", "b2", "2", "b3", "3", "4", "#4", "5", "b6", "6", "7", "△7"]}
          selected={formOptions.sequencePool}
          onChange={newSequencePool => setFormOptions({ ...formOptions, sequencePool: newSequencePool })}
          disabled={isMounted && !formOptions.enableRandomSequence}
          className="grid grid-cols-4 gap-2 mb-2 disabled:cursor-not-allowed"
        />

        {/* Number Of Sequences */}
        <label data-disabled={isMounted && !formOptions.enableRandomSequence} htmlFor="numberOfSequencesInput" className="block mt-8 font-normal text-xl text-stone-900 data-[disabled=true]:opacity-40">Number of Sequence Items</label>
        <input id="numberOfSequencesInput" type="number" className="block w-full mb-8 px-4 py-1 border-2 border-[#574141] text-lg text-stone-700 bg-[hsl(29,100%,90%)] focus:outline-0 focus:border-[#FFC053] disabled:opacity-40"
          value={formOptions.numberOfSequences || ''}
          onChange={e => {
            const val = parseInt(e.target.value) || 0;
            setFormOptions({ ...formOptions, numberOfSequences: val });
          }}
          onBlur={() => {
            if (!formOptions.numberOfSequences || formOptions.numberOfSequences < 1) {
              setFormOptions({ ...formOptions, numberOfSequences: 1 });
            }
          }}
          min={1}
          disabled={isMounted && !formOptions.enableRandomSequence}
        ></input>

        {/* Allow Sequence Duplication */}
        <label data-disabled={isMounted && !formOptions.enableRandomSequence} htmlFor="allowSequenceDuplicationInput" className="block font-normal text-xl text-stone-900 data-[disabled=true]:opacity-40">Allow sequence duplicates</label>
        <input id="allowSequenceDuplicationInput" type="checkbox" className="rootDuplication-checkbox disabled:opacity-40"
          checked={formOptions.allowSequenceDuplication}
          onChange={e => setFormOptions({ ...formOptions, allowSequenceDuplication: e.target.checked })}
          disabled={isMounted && !formOptions.enableRandomSequence}
        ></input>
      </section>


      {/* Presets & Storage Settings */}
      <section>
        <h1 className="mt-16 mb-3 font-medium text-4xl leading-8">Presets & Storage</h1>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full border-2 px-4 py-1 font-normal text-xl bg-[#ffc053] hover:bg-[hsl(30,100%,86%)] shadow-[4px_4px_var(--color-stone-900)] active:translate-1 active:shadow-none transition-all"
            onClick={() => setFormOptions(getDefaultFormOptions())}
          >Apply Default Preset</button>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(['A', 'B', 'C'] as const).map(slot => (
              <Fragment key={slot}>
                <button
                  type="button"
                  className="border-2 px-2 py-1 font-normal text-lg bg-[#ffe18a] hover:bg-[hsl(30,100%,92%)] shadow-[2px_2px_var(--color-stone-900)] active:translate-1 active:shadow-none transition-all"
                  onClick={() => handleSavePreset(`jazzPreset${slot}`)}
                >Save Preset {slot}</button>
                <button
                  type="button"
                  className="border-2 px-2 py-1 font-normal text-lg bg-[#ffd53a] hover:bg-[hsl(30,100%,96%)] shadow-[2px_2px_var(--color-stone-900)] active:translate-1 active:shadow-none transition-all"
                  onClick={() => handleLoadPreset(`jazzPreset${slot}`)}
                >Load Preset {slot}</button>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

    </form>
  );
}
