import { MetronomeSettings, MetronomeState } from '../_lib/useMetronome';
import ClampedNumberInput from './ClampedNumberInput';
import FieldLabel from './FieldLabel';

interface MetronomeControlsProps {
  metronomeSettings: MetronomeSettings;
  setMetronomeSettings: (settings: MetronomeSettings) => void;
  metronomeState: MetronomeState;
  toggleMetronome: () => void;
}

export default function MetronomeControls({
  metronomeSettings,
  setMetronomeSettings,
  metronomeState,
  toggleMetronome
}: MetronomeControlsProps) {
  return (
    <form className="leading-0" onSubmit={e => e.preventDefault()}>
      {/* Tempo */}
      <FieldLabel htmlFor="tempoInput">Tempo (BPM)</FieldLabel>
      <ClampedNumberInput id="tempoInput"
        className="mb-6 border-metronome-border text-stone-700 bg-metronome-bg focus:border-accent-pink"
        value={metronomeSettings.tempo}
        onChange={tempo => setMetronomeSettings({ ...metronomeSettings, tempo })}
        min={0}
        max={300}
        clampMin={60}
      />

      {/* Time Signature */}
      <FieldLabel htmlFor="timeSignatureSelect">Time Signature</FieldLabel>
      <select
        id="timeSignatureSelect"
        className="block w-full mb-6 px-4 py-1 border-2 border-metronome-border text-lg text-stone-700 bg-metronome-bg focus:outline-0 focus:border-accent-pink"
        value={`${metronomeSettings.timeSignature.beats}/${metronomeSettings.timeSignature.noteValue}`}
        onChange={e => {
          const [beats, noteValue] = e.target.value.split('/').map(Number);
          setMetronomeSettings({ ...metronomeSettings, timeSignature: { beats, noteValue } });
        }}
      >
        <option value="2/4">2/4</option>
        <option value="3/4">3/4</option>
        <option value="4/4">4/4</option>
        <option value="5/4">5/4</option>
        <option value="6/8">6/8</option>
        <option value="7/8">7/8</option>
        <option value="9/8">9/8</option>
        <option value="12/8">12/8</option>
      </select>

      {/* Prevent Switching Measures */}
      <div className="mb-6">
        <FieldLabel htmlFor="preventSwitchingCheckbox" className="cursor-pointer">Prevent Switching Chords</FieldLabel>
        <input
          id="preventSwitchingCheckbox"
          type="checkbox"
          className="appearance-auto block border-2 size-5 accent-accent-pink cursor-pointer"
          checked={metronomeSettings.preventSwitching}
          onChange={e => setMetronomeSettings({ ...metronomeSettings, preventSwitching: e.target.checked })}
        />
      </div>

      {/* Measures Between Changes */}
      <label htmlFor="measuresInput" className={`block font-normal text-xl ${metronomeSettings.preventSwitching ? 'text-stone-400' : 'text-stone-900'}`}>Measures Between Chord Changes</label>
      <ClampedNumberInput id="measuresInput"
        className={`mb-6 ${metronomeSettings.preventSwitching ? 'border-stone-400 text-stone-400 bg-stone-200 cursor-not-allowed' : 'border-metronome-border text-stone-700 bg-metronome-bg focus:border-accent-pink'}`}
        value={metronomeSettings.measures}
        onChange={measures => setMetronomeSettings({ ...metronomeSettings, measures })}
        min={1}
        max={32}
        disabled={metronomeSettings.preventSwitching}
      />

      {/* Beat Indicator */}
      {metronomeState.isPlaying && (
        <div className="mb-6">
          {!metronomeSettings.preventSwitching && (
            <p className="text-sm font-normal text-stone-700 mb-2">
              Measure {Math.floor(metronomeState.currentMeasure % metronomeSettings.measures) + 1} / {metronomeSettings.measures}
            </p>
          )}
          <div className="flex gap-2">
            {Array.from({ length: metronomeSettings.timeSignature.beats }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 border-2 border-stone-900 rounded-full ${
                  i === metronomeState.currentBeat
                    ? 'bg-accent-pink'
                    : i === 0
                    ? 'bg-stone-400'
                    : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Start/Stop Button */}
      <button
        type="button"
        onClick={toggleMetronome}
        className="w-full px-8 py-2 bg-accent-pink border-2 border-stone-900 font-neobrutalist font-[450] text-xl text-stone-900/90 shadow-[4px_4px_var(--color-stone-900)]
        hover:bg-[#ff5bb0] active:translate-1 active:shadow-none transition-all duration-75 cursor-pointer"
      >
        {metronomeState.isPlaying ? 'Stop' : 'Start'} Metronome
      </button>
    </form>
  );
}
