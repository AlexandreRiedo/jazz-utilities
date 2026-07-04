function ChordGrid({ chords, guideTones, showGuideTones }: {
  chords: string[];
  guideTones: string[];
  showGuideTones: boolean;
}) {
  // A full 2x4/4-col grid looks fine at 4+ chords, but leaves dead space and
  // left-aligned items below that. So few chords instead get a single column
  // on mobile, and a centered row on desktop.
  const isFullGrid = chords.length >= 4;

  return (
    <div className={isFullGrid
      ? "grid grid-cols-2 gap-y-8 place-content-center flex-1 sm:grid-cols-4 lg:grid-cols-4 lg:gap-y-24"
      : "flex flex-col sm:flex-row lg:flex-row flex-wrap justify-center items-center gap-8 flex-1 lg:gap-x-16 lg:gap-y-24"
    }>
      {chords.map((chord, index) => (
        <output key={index} className="text-center font-neobrutalist font-[450]
        text-4xl lg:text-5xl xl:text-6xl">
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
