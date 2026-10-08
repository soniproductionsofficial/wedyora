type PartnerHeroBackgroundProps = {
  version?: number
}

export function PartnerHeroBackground({ version = 9 }: PartnerHeroBackgroundProps) {
  const v = `?v=${version}`

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source
        type="image/webp"
        srcSet={`/vendor/login-bg.webp${v} 1920w, /vendor/login-bg@2x.webp${v} 2560w`}
        sizes="100vw"
      />
      <img
        src={`/vendor/login-bg.jpg${v}`}
        srcSet={`/vendor/login-bg.jpg${v} 1920w, /vendor/login-bg@2x.jpg${v} 2560w`}
        sizes="100vw"
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        className="h-full w-full object-cover object-[18%_55%] lg:object-[22%_50%]"
      />
    </picture>
  )
}
