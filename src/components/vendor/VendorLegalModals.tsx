import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type LegalModalKind = 'terms' | 'cancellation' | null

const CANCELLATION_PENALTIES = [
  { history: 'First cancellation without valid reason', action: 'Written warning and performance review' },
  {
    history: 'Second cancellation within 12 months',
    action: 'Temporary suspension from receiving new bookings for up to 30 days',
  },
  {
    history: 'Third cancellation within 12 months',
    action: 'Suspension for up to 90 days and review for continued association',
  },
  { history: 'Repeated or deliberate cancellations', action: 'Permanent removal from the WEDYORA platform' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="font-display text-lg text-[#3a2f32]">{title}</h3>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

function VendorTermsContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">
        I hereby apply to be registered as a Photography Vendor with WEDYORA and voluntarily agree to the following
        Terms &amp; Conditions:
      </p>

      <Section title="Accuracy of Information">
        <p>
          I declare that all information, documents, portfolio, and photographs submitted by me are true, accurate, and
          belong to me or my business.
        </p>
      </Section>

      <Section title="Verification">
        <p>
          I authorize WEDYORA to verify my identity, business details, work portfolio, customer references, equipment,
          experience, and other information provided during registration.
        </p>
      </Section>

      <Section title="Independent Vendor">
        <p>
          I understand that my registration with WEDYORA does not create an employer-employee relationship, partnership,
          franchise, or agency. I will work as an independent service provider.
        </p>
      </Section>

      <Section title="Assignment Acceptance">
        <p>
          I understand that booking assignments are offered based on availability, customer preferences, vendor ratings,
          location, quality standards, and operational requirements. WEDYORA does not guarantee a minimum number of
          bookings.
        </p>
      </Section>

      <Section title="Professional Conduct">
        <p>
          I agree to maintain professional behaviour, punctuality, proper dress code, courteous communication, and
          high-quality service at every assignment.
        </p>
      </Section>

      <Section title="Equipment Responsibility">
        <p>
          I shall carry fully functional cameras, lenses, flashes, lighting equipment, batteries, memory cards, storage
          devices, and necessary backup equipment to every assignment.
        </p>
      </Section>

      <Section title="Customer Privacy">
        <p>
          I shall maintain complete confidentiality of customer information, wedding details, contact information, and
          personal data.
        </p>
      </Section>

      <Section title="Social Media Usage">
        <p>
          I shall not upload, publish, or share any customer photographs, videos, reels, or behind-the-scenes content on
          social media or any digital platform without obtaining written approval from both the customer and WEDYORA.
        </p>
      </Section>

      <Section title="Non-Solicitation">
        <p>I shall not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Share my personal business card with WEDYORA customers.</li>
          <li>Offer discounts directly to customers.</li>
          <li>Collect direct payments.</li>
          <li>Divert customers away from WEDYORA.</li>
          <li>Promote competing businesses during assignments.</li>
        </ul>
      </Section>

      <Section title="Payment">
        <p>
          I understand that payments will be processed only after successful completion of the assignment, submission of
          all required files, completion of quality checks, and in accordance with WEDYORA&apos;s payment policy.
        </p>
      </Section>

      <Section title="Cancellation">
        <p>
          If I accept an assignment, I agree not to cancel it except in genuine emergencies. Repeated cancellations may
          lead to penalties, suspension, or removal from the platform.
        </p>
      </Section>

      <Section title="Quality Standards">
        <p>
          I agree to meet WEDYORA&apos;s quality requirements for photography, customer service, professionalism, and
          timely delivery. Failure to maintain these standards may affect future assignments.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          I acknowledge that all content created during WEDYORA assignments shall be handled in accordance with the
          agreement between WEDYORA and the customer. I shall not sell, distribute, or commercially use customer media
          without written authorization.
        </p>
      </Section>

      <Section title="Compliance">
        <p>
          I agree to comply with all applicable laws, safety regulations, venue rules, drone regulations (where
          applicable), and WEDYORA operational policies.
        </p>
      </Section>

      <Section title="Suspension and Termination">
        <p>
          I understand that WEDYORA reserves the right to suspend or terminate my registration for fraud, submission of
          false information, poor service quality, customer complaints, misconduct, breach of confidentiality, or violation
          of these Terms &amp; Conditions.
        </p>
      </Section>

      <Section title="Governing Law">
        <p>
          This agreement shall be governed by the laws of India, and any disputes shall be subject to the jurisdiction
          of the courts in Bengaluru, Karnataka.
        </p>
      </Section>

      <div className="rounded-xl border border-[#8e1454]/15 bg-[#fff8f9] p-4">
        <h3 className="font-display text-lg text-[#3a2f32]">Vendor Acceptance</h3>
        <p className="mt-2 text-sm text-muted">I confirm that:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>I have carefully read and understood all the above Terms &amp; Conditions.</li>
          <li>I voluntarily agree to abide by all WEDYORA policies and guidelines.</li>
          <li>
            I understand that failure to comply may result in penalties, suspension, or permanent removal from the
            WEDYORA platform.
          </li>
          <li>
            I consent to receive communications from WEDYORA regarding my registration, bookings, payments, training,
            and operational updates.
          </li>
        </ul>
      </div>
    </div>
  )
}

function VendorCancellationContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-muted">
        This Vendor Cancellation Policy forms part of the WEDYORA Vendor Agreement and applies to all registered vendors,
        including photographers, videographers, drone operators, makeup artists, decorators, caterers, venues,
        entertainers, transportation providers, priests, mehendi artists, and other service partners.
      </p>

      <Section title="Purpose">
        <p>This policy is intended to ensure reliable service for customers and to minimize disruptions caused by vendor cancellations.</p>
      </Section>

      <Section title="Vendor Commitment">
        <p>
          Once a booking is accepted through WEDYORA, the Vendor is responsible for delivering the agreed services on the
          scheduled date and time.
        </p>
      </Section>

      <Section title="Cancellation by Vendor">
        <p>A Vendor shall not cancel an accepted booking except in exceptional circumstances, such as:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Serious medical emergency.</li>
          <li>Death of an immediate family member.</li>
          <li>Natural disaster or government-imposed restrictions.</li>
          <li>Major accident or other unavoidable events beyond the Vendor&apos;s control.</li>
        </ul>
        <p>The Vendor must notify WEDYORA immediately and provide supporting documents if requested.</p>
      </Section>

      <Section title="Advance Notice">
        <p>
          If cancellation is unavoidable, the Vendor must inform WEDYORA as early as possible. Failure to provide timely
          notice may result in penalties.
        </p>
      </Section>

      <Section title="Replacement Vendor">
        <p>
          WEDYORA may appoint a replacement Vendor to ensure uninterrupted service to the customer. The original Vendor
          shall cooperate by providing any information reasonably required for a smooth handover.
        </p>
      </Section>

      <Section title="Cancellation Penalties">
        <p>The following actions may be taken depending on the nature and frequency of cancellations:</p>
        <div className="overflow-hidden rounded-xl border border-[#8e1454]/12">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fff8f9]">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-[#3a2f32]">Cancellation History</th>
                <th className="px-4 py-2.5 font-semibold text-[#3a2f32]">Action</th>
              </tr>
            </thead>
            <tbody>
              {CANCELLATION_PENALTIES.map((row, i) => (
                <tr key={row.history} className={cn(i > 0 && 'border-t border-[#8e1454]/08')}>
                  <td className="px-4 py-3 align-top">{row.history}</td>
                  <td className="px-4 py-3 align-top">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Where WEDYORA incurs reasonable costs due to the Vendor&apos;s unjustified cancellation, the Company may recover
          such costs from future payments, subject to applicable law and the Vendor Agreement.
        </p>
      </Section>

      <Section title="Customer Compensation">
        <p>
          If a Vendor&apos;s unjustified cancellation causes WEDYORA to incur additional expenses to arrange an alternative
          service, WEDYORA may recover those reasonable costs from the Vendor in accordance with the Vendor Agreement and
          applicable law.
        </p>
      </Section>

      <Section title="No-Show Policy">
        <p>A Vendor who fails to report to the venue without prior notice shall be treated as a &ldquo;No-Show.&rdquo; Consequences may include:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Immediate suspension.</li>
          <li>Reduction in booking priority.</li>
          <li>Negative performance rating.</li>
          <li>Financial recovery of reasonable losses incurred by WEDYORA.</li>
          <li>Permanent removal for repeated no-shows.</li>
        </ul>
      </Section>

      <Section title="Late Arrival">
        <p>If a Vendor anticipates a delay, they must immediately inform the WEDYORA Operations Team. Repeated delays may result in:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Reduced booking priority.</li>
          <li>Performance review.</li>
          <li>Temporary suspension for repeated violations.</li>
        </ul>
      </Section>

      <Section title="Emergency Exceptions">
        <p>
          WEDYORA may waive penalties where the Vendor provides satisfactory evidence of genuine emergencies. Approval of
          any waiver is at WEDYORA&apos;s discretion.
        </p>
      </Section>

      <Section title="False Emergency Claims">
        <p>
          Providing false or misleading information to justify a cancellation may result in immediate suspension or
          permanent termination of the Vendor&apos;s registration.
        </p>
      </Section>

      <Section title="Force Majeure">
        <p>
          Neither WEDYORA nor the Vendor shall be liable for failure to perform obligations due to events beyond reasonable
          control, including natural disasters, war, civil unrest, government restrictions, epidemics, or other force
          majeure events.
        </p>
      </Section>

      <Section title="Appeals">
        <p>
          A Vendor may submit a written explanation or supporting documents within seven (7) days of receiving notice of a
          penalty. WEDYORA will review the appeal and communicate its decision.
        </p>
      </Section>

      <Section title="Policy Updates">
        <p>
          WEDYORA reserves the right to amend this Cancellation Policy from time to time. Updated versions will apply from
          the date they are published or otherwise notified to Vendors.
        </p>
      </Section>

      <div className="rounded-xl border border-[#8e1454]/15 bg-[#fff8f9] p-4">
        <h3 className="font-display text-lg text-[#3a2f32]">Vendor Acknowledgement</h3>
        <p className="mt-2 text-sm text-muted">
          By registering with WEDYORA and accepting assignments through the platform, the Vendor confirms that they have
          read, understood, and agree to comply with this Vendor Cancellation Policy.
        </p>
      </div>
    </div>
  )
}

const MODAL_META = {
  terms: {
    title: 'Wedyora Photography Vendor Terms & Conditions',
    updated: 'Last updated: July 31, 2026',
    content: <VendorTermsContent />,
  },
  cancellation: {
    title: 'Wedyora Vendor Cancellation Policy',
    updated: 'Last updated: July 31, 2026',
    content: <VendorCancellationContent />,
  },
} as const

export function VendorLegalModal({
  kind,
  onClose,
}: {
  kind: LegalModalKind
  onClose: () => void
}) {
  if (!kind) return null
  const meta = MODAL_META[kind]

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/55 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#8e1454]/10 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8e1454]">{meta.updated}</p>
            <h2 className="mt-1 font-display text-2xl text-[#3a2f32]">{meta.title}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#8e1454]/20 text-[#8e1454] hover:bg-[#fff8f9]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{meta.content}</div>
        <div className="border-t border-[#8e1454]/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-[#8e1454] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7a1048]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function VendorAgreementFields({
  agreeTerms,
  agreeCancellation,
  onAgreeTerms,
  onAgreeCancellation,
  onOpenTerms,
  onOpenCancellation,
}: {
  agreeTerms: boolean
  agreeCancellation: boolean
  onAgreeTerms: (v: boolean) => void
  onAgreeCancellation: (v: boolean) => void
  onOpenTerms: () => void
  onOpenCancellation: () => void
}) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-[#8e1454]/12 bg-[#fffdfd] p-4 sm:col-span-2">
      <legend className="px-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Agreements</legend>

      <label className="flex items-start gap-3 text-sm text-[#3a2f32]">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreeTerms}
          onChange={(e) => onAgreeTerms(e.target.checked)}
        />
        <span>
          I have read, understood, and agree to the{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="font-semibold text-[#8e1454] underline underline-offset-2 hover:text-[#7a1048]"
          >
            Wedyora Photography Vendor Terms &amp; Conditions
          </button>
          .
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-[#3a2f32]">
        <input
          type="checkbox"
          className="mt-1"
          checked={agreeCancellation}
          onChange={(e) => onAgreeCancellation(e.target.checked)}
        />
        <span>
          I have read, understood, and agree to comply with the{' '}
          <button
            type="button"
            onClick={onOpenCancellation}
            className="font-semibold text-[#8e1454] underline underline-offset-2 hover:text-[#7a1048]"
          >
            Vendor Cancellation Policy
          </button>
          .
        </span>
      </label>
    </fieldset>
  )
}
