import { PartnerHeroBackground } from '../../components/vendor/PartnerHeroBackground'
import { PartnerJoinCard } from '../../components/vendor/PartnerJoinCard'
import { PartnerPortalHero } from '../../components/vendor/PartnerPortalHero'

export function VendorJoin() {
  return (
    <section className="relative min-h-[calc(100dvh-4.75rem)] w-full overflow-hidden">
      <PartnerHeroBackground version={10} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.75rem)] max-w-7xl flex-col gap-8 px-5 pb-10 pt-5 sm:pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-10 lg:pt-7 xl:px-14">
        <div className="w-full lg:max-w-[46%]">
          <PartnerPortalHero />
        </div>

        <div className="w-full shrink-0 lg:max-w-md lg:mt-14 lg:ml-auto">
          <PartnerJoinCard />
        </div>
      </div>
    </section>
  )
}
