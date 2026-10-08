import { WhatsAppIcon, whatsappBusinessHref } from './WhatsAppIcon'

/** Fixed bottom-right WhatsApp button — number wired later via VITE_WHATSAPP_BUSINESS_NUMBER. */
export function WhatsAppFloat() {
  const href = whatsappBusinessHref()
  const className =
    'fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebe5d] md:bottom-8 md:right-8 md:h-[3.75rem] md:w-[3.75rem]'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className={className}>
        <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
      </a>
    )
  }

  return (
    <span role="img" aria-label="WhatsApp" title="WhatsApp Business number coming soon" className={className}>
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
    </span>
  )
}
