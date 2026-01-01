import { MetronomeSettings, MetronomeState } from './useMetronome';

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
      <label htmlFor="tempoInput" className="block font-normal text-xl text-stone-900">Tempo (BPM)</label>
      <input
        id="tempoInput"
        type="number"
        className="block w-full mb-6 px-4 py-1 border-2 border-[#7a3950] text-lg text-stone-700 bg-[#ffe0f0] focus:outline-0 focus:border-[#ff389c]"
        value={metronomeSettings.tempo}
        onChange={e => setMetronomeSettings({ ...metronomeSettings, tempo: parseInt(e.target.value) || 60 })}
        min={40}
        max={300}
      />

      {/* Time Signature */}
      <label htmlFor="timeSignatureSelect" className="block font-normal text-xl text-stone-900">Time Signature</label>
      <select
        id="timeSignatureSelect"
        className="block w-full mb-6 px-4 py-1 border-2 border-[#7a3950] text-lg text-stone-700 bg-[#ffe0f0] focus:outline-0 focus:border-[#ff389c]"
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

      {/* Measures Between Changes */}
      <label htmlFor="measuresInput" className="block font-normal text-xl text-stone-900">Measures Between Chord Changes</label>
      <input
        id="measuresInput"
        type="number"
        className="block w-full mb-6 px-4 py-1 border-2 border-[#7a3950] text-lg text-stone-700 bg-[#ffe0f0] focus:outline-0 focus:border-[#ff389c]"
        value={metronomeSettings.measures}
        onChange={e => setMetronomeSettings({ ...metronomeSettings, measures: parseInt(e.target.value) || 1 })}
        min={1}
        max={32}
      />

      {/* Beat Indicator */}
      {metronomeState.isPlaying && (
        <div className="mb-6">
          <p className="text-sm font-normal text-stone-700 mb-2">
            Measure {Math.floor(metronomeState.currentMeasure % metronomeSettings.measures) + 1} / {metronomeSettings.measures}
          </p>
          <div className="flex gap-2">
            {Array.from({ length: metronomeSettings.timeSignature.beats }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 border-2 border-stone-900 rounded-full ${
                  i === metronomeState.currentBeat
                    ? 'bg-[#ff389c]'
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
        className="w-full px-8 py-2 bg-[#ff389c] border-2 border-stone-900 font-neobrutalist font-[450] text-xl text-stone-900/90 shadow-[4px_4px_var(--color-stone-900)]
        hover:bg-[#ff5bb0] active:translate-1 active:shadow-none transition-all duration-75 cursor-pointer"
      >
        {metronomeState.isPlaying ? 'Stop' : 'Start'} Metronome
      </button>
    </form>
  );
}
