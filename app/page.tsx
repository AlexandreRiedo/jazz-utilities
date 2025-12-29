export default function Home() {
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
          <section className="relative flex flex-row flex-wrap items-center justify-center gap-8 mx-4 p-4 min-h-64 text-stone-900 border-3 border-stone-900  bg-[#fff3f5] shadow-[8px_8px_var(--color-stone-900)]">
            <output className="font-neobrutalist font-[450] text-8xl">
              <span className="block text-center font-normal text-6xl text-stone-600">9</span>
              D∆7♯11</output>
            <output className="font-neobrutalist font-[450] text-8xl">
              <span className="block text-center font-normal text-6xl text-stone-600">9</span>
              E♭9</output>
          </section>

          {/* Button Area */}
          <div className="relative flex justify-end py-8 w-full mt-16 px-4 border-y-0 border-[#7e4651] bg-[#ffa7b6]">
            <button className="px-8 py-2 bg-[#ff3859] border-2 border-stone-900 font-neobrutalist font-[450] text-[1.75rem] text-stone-900/90 shadow-[8px_8px_var(--color-stone-900)]
            hover:bg-[#d61c3b] active:translate-2 active:shadow-none transition-all cursor-pointer">Randomize Chords!</button>
          </div>
        </div>

        {/* Form Options */}
        <div className="">
        </div>
      </main>
    </>
  );
}
