function ChordGrid({ chords, guideTones, showGuideTones }: {
  chords: string[];
  guideTones: string[];
  showGuideTones: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-y-8 place-content-center flex-1
    sm:grid-cols-4
    lg:grid-cols-4 lg:gap-y-24">
      {chords.map((chord, index) => (
        <output key={index} className="text-center font-neobrutalist font-[450]
        text-4xl lg:text-6xl">
          {showGuideTones && (
            <span className="block text-center font-normal text-stone-600
            text-3xl lg:text-4xl">
              {guideTones[index]}
            </span>
          )}
          {chord}
        </output>
      ))}
    </div>
  );
}

export default ChordGrid;
