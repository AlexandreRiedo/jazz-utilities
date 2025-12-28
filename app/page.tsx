export default function Home() {
  return (
    <>
      <main className="grid grid-rows-[70fr_30fr] min-h-screen bg-rose-200">
        {/* Chord Display */}
        <div className="self-end flex flex-col justify-center">
          <section className="flex items-center mx-4 p-4 min-h-64 border-3 border-stone-900  bg-[#fff3f5] shadow-[8px_8px_var(--color-stone-900)]">
            <output className="font-neobrutalist font-[450] text-8xl">D∆7♯11</output>
            {/* <output className="self-end mx-4 mb-8 font-neobrutalist font-medium text-4xl">D∆7♯11 B♭13 E♭maj9 Eº</output> */}
          </section>
          <div className="flex justify-end w-full mt-16 px-4 border-y-0 border-[#7e4651] bg-[#ffa7b6]">
            <button className="relative bottom-4 px-8 py-2 bg-[#ff3859] border-3 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900 shadow-[8px_8px_var(--color-stone-900)]">Randomize Chords!</button>
          </div>
        </div>

        {/* Form Options */}
        <div>
        </div>
      </main>
    </>
  );
}
