const LINE_ONE_WORDS = ['The', "World's", 'First', 'Wedding', 'Service', 'Platform'] as const

function HeroTitleWord({ word, index }: { word: string; index: number }) {
  return (
    <span className={`hero-title-word hero-title-word--slot-${index}`}>
      {word}
    </span>
  )
}

export function HeroHeadline() {
  return (
    <div className="hero-headline mx-auto max-w-5xl text-center">
      <p className="hero-title-line font-display text-[clamp(1.35rem,3.8vw,2.65rem)] font-semibold leading-[1.15] tracking-[0.02em] text-white">
        {LINE_ONE_WORDS.map((word, index) => (
          <HeroTitleWord key={word} word={word} index={index} />
        ))}
      </p>
      <p className="hero-line-two mt-3 font-tagline text-[clamp(1.55rem,4.2vw,2.55rem)] font-normal leading-[1.25] tracking-[0.02em] sm:mt-4">
        We Own the Order, Our Partners Deliver.
      </p>
    </div>
  )
}
