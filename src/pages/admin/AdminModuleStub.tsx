type Props = {
  title: string
  blurb: string
}

/** Placeholder for admin modules not yet wired to live data. */
export function AdminModuleStub({ title, blurb }: Props) {
  return (
    <div className="px-6 py-8 lg:px-10">
      <h1 className="font-display text-3xl text-[#3a2f32]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">{blurb}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-[#8e1454]/25 bg-white p-10 text-center">
        <p className="text-sm text-[#3a2f32]">Module shell ready — connect workflows next.</p>
        <p className="mt-2 text-xs text-muted">From Wedyora Admin Portal flowchart.</p>
      </div>
    </div>
  )
}
