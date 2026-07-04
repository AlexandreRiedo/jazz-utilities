function SequenceGrid({ sequence }: { sequence: string[] }) {
  return (
    <>
      <hr className="my-8 sm:my-8 h-0.5 w-[90%] mx-auto bg-stone-900/90" />
      <div className="grid grid-cols-4 gap-y-2 place-content-center
      sm:grid-cols-4
      lg:grid-cols-4 lg:gap-y-8 lg:gap-x-8 lg:self-center">
        {sequence.map((item, index) => (
          <output key={index} className="text-center font-neobrutalist font-[450]
          text-3xl lg:text-5xl text-stone-900/90">
            {item}
          </output>
        ))}
      </div>
    </>
  );
}

export default SequenceGrid;
