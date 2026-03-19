import { useMemo, useState } from 'react'

function App() {
  const navItems = [
    { href: '#product', label: 'Product' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#pilot', label: 'Pilot' },
    { href: '#contact', label: 'Contact' },
  ] as const

  const decisions = [
    { id: 'Decision #4821', level: 'High Risk', reason: 'Low confidence + override + missing documentation' },
    { id: 'Decision #4814', level: 'High Risk', reason: 'Anomalous denial pattern vs baseline' },
    { id: 'Decision #4809', level: 'Review', reason: 'Missing documentation for adverse action notice' },
    { id: 'Decision #4802', level: 'High Risk', reason: 'Override without justification (notes empty)' },
    { id: 'Decision #4794', level: 'Review', reason: 'Low confidence band near policy threshold' },
    { id: 'Decision #4788', level: 'High Risk', reason: 'Identity mismatch signal + override' },
    { id: 'Decision #4779', level: 'Review', reason: 'Late-stage denial after manual change' },
  ] as const

  const [lead, setLead] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const fieldErrors = useMemo(() => {
    const errors: Partial<Record<keyof typeof lead, string>> = {}
    if (!lead.name.trim()) errors.name = 'Full name is required'
    if (!lead.email.trim()) errors.email = 'Work email is required'
    if (!lead.company.trim()) errors.company = 'Company is required'
    return errors
  }, [lead.company, lead.email, lead.name])

  async function submitLead(e: React.FormEvent) {
    e.preventDefault()
    console.log('submit started')

    setSubmitSuccess(false)
    setSubmitError(null)

    if (Object.keys(fieldErrors).length) {
      setSubmitError('Please complete the required fields.')
      return
    }

    setIsSubmitting(true)
    try {
      console.log('fetch started')
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          role: lead.role || undefined,
          message: lead.message || undefined,
        }),
      })

      console.log('response status', res.status)

      const raw = await res.text()
      let parsed: unknown = null
      try {
        parsed = raw ? JSON.parse(raw) : null
      } catch {
        parsed = null
      }
      console.log('parsed response JSON', parsed)

      const data = parsed as
        | { success?: boolean; error?: string; details?: string }
        | null

      if (!res.ok) {
        const msg = data?.error || 'Submission failed'
        const details = data?.details ? ` (${data.details})` : ''
        throw new Error(`${msg}${details}`)
      }
      if (!data?.success) {
        const msg = data?.error || 'Submission failed'
        const details = data?.details ? ` (${data.details})` : ''
        throw new Error(`${msg}${details}`)
      }

      setSubmitSuccess(true)
      setLead({ name: '', email: '', company: '', role: '', message: '' })
    } catch (err) {
      console.log('caught error', err)
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
      console.log('loading cleared')
    }
  }

  return (
    <div className="min-h-dvh bg-[#f7f7f5] text-slate-900">
      {/* 1. Sticky top navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-[#f7f7f5]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a href="#" className="inline-flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70">
              <span className="size-2.5 rounded-full bg-[#3b5bdb]" />
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-900">
              SignalLayer
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="text-sm text-slate-600 transition hover:text-slate-900"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b5bdb]"
            href="#contact"
          >
            Book a Demo
          </a>
        </div>
      </header>

      <main>
        {/* 2. Hero */}
        <section className="relative">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-14 sm:px-6 md:grid-cols-2 md:items-start md:pb-18 md:pt-20">
            <div className="pt-2">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                AI is making leasing decisions. Who’s managing the risk?
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                SignalLayer monitors tenant screening, approvals, and leasing workflows to flag compliance and liability
                risks before they turn into lawsuits or operational issues.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b5bdb]"
                  href="#contact"
                >
                  Request Pilot
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b5bdb]"
                  href="#how-it-works"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-5 text-sm text-slate-600">
                We’ll follow up with a quick walkthrough + sample risk analysis.
              </div>
            </div>

            {/* Product UI mock */}
            <div id="product" className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <div className="text-xs font-semibold text-slate-700">SignalLayer Risk Queue</div>
                  <div className="text-[11px] text-slate-500">Screening decisions • Live</div>
                </div>

                <div className="grid gap-3 p-4">
                  {/* Alert banner */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold text-amber-900">Property Risk Alert</div>
                        <div className="mt-1 text-sm text-amber-900/80">
                          Property A denial rate is <span className="font-semibold">2.8x baseline</span>. Review recommended.
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200">
                        Elevated
                      </span>
                    </div>
                  </div>

                  {/* Queue + factors */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-700">High-Risk Decision Queue</div>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                          {decisions.length} flagged
                        </span>
                      </div>

                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left text-[12px]">
                          <thead className="bg-slate-50 text-slate-600">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Decision</th>
                              <th className="px-3 py-2 font-semibold">Risk</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {decisions.map((d) => (
                              <tr key={d.id} className="bg-white align-top">
                                <td className="px-3 py-2">
                                  <div className="text-slate-800">{d.id}</div>
                                  <div className="mt-0.5 text-[11px] text-slate-500">{d.reason}</div>
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={
                                      d.level === 'High Risk'
                                        ? 'inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200'
                                        : 'inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200'
                                    }
                                  >
                                    {d.level}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-900/80">
                        <span className="font-semibold">Decision #4821 — High Risk.</span>{' '}
                        Reason: <span className="font-semibold">Low confidence + override + missing documentation.</span>{' '}
                        <span className="font-semibold">Flagged for Fair Housing review.</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs font-semibold text-slate-700">Explainable Risk Factors</div>
                      <div className="mt-3 space-y-2 text-[12px] text-slate-700">
                        {[
                          ['Low confidence', 'Model confidence below threshold for denial outcome'],
                          ['Override detected', 'Manual override without corresponding justification'],
                          ['Missing documentation', 'Required notes not attached to decision record'],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-semibold text-slate-800">{k}</div>
                              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                Contributing
                              </span>
                            </div>
                            <div className="mt-1 text-slate-600">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Audit snapshot */}
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-slate-700">Audit Snapshot</div>
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Evidence ready
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {[
                        ['Decision record', 'Captured inputs + outcome'],
                        ['Policy mapping', 'Fair Housing flags evaluated'],
                        ['Change log', 'Overrides and timestamps'],
                        ['Reviewer notes', 'Structured justification fields'],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <div className="text-[12px] font-semibold text-slate-800">{k}</div>
                          <div className="mt-0.5 text-[12px] text-slate-600">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[12px] text-slate-500">
                SignalLayer is <span className="font-semibold text-slate-700">not</span> a tenant screening tool, compliance dashboard,
                reporting layer, or system replacement.
              </div>
            </div>
          </div>
        </section>

        {/* 3. Problem */}
        <section className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Leasing is getting automated. Risk isn’t.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Property management teams are adopting AI across leasing — from tenant screening to approvals to
              communication. But when decisions are automated, accountability gets blurry. Compliance risk, Fair Housing
              exposure, and inconsistent decisions become harder to detect — and more expensive when missed.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                ['Opaque screening decisions', 'Outcomes are easy to see. Defensible reasoning often isn’t.'],
                ['Fair Housing exposure', 'Risk accumulates quietly across denials and overrides.'],
                ['Limited internal visibility', 'Decision context lives across tools, teams, and vendors.'],
                ['Weak audit readiness', 'Evidence is incomplete when you need to prove what happened.'],
              ].map(([title, body]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3b. What SignalLayer does */}
        <section className="border-t border-slate-200/70 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  A risk layer for AI-driven leasing
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  SignalLayer sits alongside your leasing workflows and continuously evaluates decisions for potential
                  risk before they are executed or finalized.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">What we flag</div>
                <div className="mt-4 grid gap-3">
                  {[
                    'Tenant screening decisions that may introduce bias or Fair Housing risk',
                    'Approvals or denials without sufficient documented justification',
                    'AI-generated leasing communication that creates legal exposure',
                    'Inconsistent decision patterns across properties or operators',
                  ].map((x) => (
                    <div key={x} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">•</span> <span>{x}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Category shift */}
        <section className="border-t border-slate-200/70 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              From reactive audits to real-time risk visibility
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Old way</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {[
                    'Review after complaints',
                    'Fragmented logs',
                    'Vendor-dependent reporting',
                    'Manual investigation',
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-300" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">With SignalLayer</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {[
                    'Real-time detection',
                    'Decision-level visibility',
                    'Pattern and anomaly alerts',
                    'Structured evidence on demand',
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3b5bdb]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. How it works */}
        <section id="how-it-works" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              How it works
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ['1', 'Connect to your leasing workflow', 'Screening, approvals, and communication tools'],
                ['2', 'Analyze decisions and supporting context', 'Evaluate actions, patterns, and documentation'],
                ['3', 'Flag high-risk actions before they become issues', 'Surface risky decisions before they create legal or operational problems'],
              ].map(([n, title, body]) => (
                <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="inline-flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {n}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{title}</span>
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-slate-600">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Product proof */}
        <section className="border-t border-slate-200/70 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              See where risk is building before it becomes a problem
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              See the exact decisions and patterns most likely to create legal or compliance exposure.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                [
                  'High-Risk Decision Queue',
                  'A decision-level queue with risk level and specific reasons for review.',
                  'Decision #4821 — High Risk',
                ],
                [
                  'Property Risk Alert',
                  'Detect denial-rate anomalies and escalation signals before they become complaints.',
                  'Property A denial rate is 2.8x baseline',
                ],
                [
                  'Explainable Risk Scoring',
                  'Transparent factors so review is consistent and defensible.',
                  'Low confidence + override + missing documentation',
                ],
                [
                  'Audit Snapshot',
                  'Structured evidence tied to the decision, timeline, and reviewer actions.',
                  'Review recommended',
                ],
              ].map(([title, body, example]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                      In-product
                    </span>
                  </div>
                  <div className="mt-3 text-sm leading-relaxed text-slate-600">{body}</div>
                  <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-700">
                    <span className="font-semibold">Example:</span> {example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Pilot */}
        <section id="pilot" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Start with one workflow. See risk immediately.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  SignalLayer runs alongside your existing screening process with minimal disruption. Start with a single workflow,
                  monitor live decisions, and identify which decisions and patterns could create Fair Housing or compliance exposure.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {['30-day pilot', 'Minimal integration', 'Real decision data', 'No rip-and-replace'].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3b5bdb]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Pilot scope</div>
                <div className="mt-3 grid gap-3">
                  {[
                    ['Workflow', 'AI-assisted screening + lease approval decisions'],
                    ['Outputs', 'Queue, alerts, explainable factors, audit snapshot'],
                    ['Cadence', 'Weekly review of findings with your ops team'],
                    ['Result', 'Clear view into decision-level exposure and trends'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="text-[12px] font-semibold text-slate-700">{k}</div>
                      <div className="text-[12px] text-slate-600">{v}</div>
                    </div>
                  ))}
                </div>
                <a
                  className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b5bdb]"
                  href="#contact"
                >
                  Book a Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="border-t border-slate-200/70 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Start catching risk before it becomes a problem
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Book a demo to see how SignalLayer surfaces risky decisions before they become expensive problems.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  href="#contact"
                >
                  Request Pilot
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  href="#contact"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact (for nav + conversion) */}
        <section id="contact" className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Request a pilot walkthrough.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Where are you seeing risk or uncertainty in leasing decisions? We’ll use that context to show what
                  SignalLayer would flag in your workflow.
                </p>
                <div className="mt-6 text-sm text-slate-600">
                  Or email us at{' '}
                  <a className="font-semibold text-slate-900 underline underline-offset-4" href="mailto:hello@signallayer.ai">
                    hello@signallayer.ai
                  </a>
                  .
                </div>
              </div>

              <form
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                onSubmit={submitLead}
              >
                <div className="grid gap-4">
                  <div>
                    <label className="text-[12px] font-semibold text-slate-700" htmlFor="name">
                      Full name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="name"
                      value={lead.name}
                      onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                      placeholder="Alex Morgan"
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name ? (
                      <div className="mt-1 text-[12px] text-rose-700">{fieldErrors.name}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-700" htmlFor="email">
                      Work email <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={lead.email}
                      onChange={(e) => setLead((s) => ({ ...s, email: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                      placeholder="alex@company.com"
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                    />
                    {fieldErrors.email ? (
                      <div className="mt-1 text-[12px] text-rose-700">{fieldErrors.email}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-700" htmlFor="company">
                      Company <span className="text-rose-600">*</span>
                    </label>
                    <input
                      id="company"
                      value={lead.company}
                      onChange={(e) => setLead((s) => ({ ...s, company: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                      placeholder="Property Management Co."
                      autoComplete="organization"
                      aria-invalid={Boolean(fieldErrors.company)}
                    />
                    {fieldErrors.company ? (
                      <div className="mt-1 text-[12px] text-rose-700">{fieldErrors.company}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-700" htmlFor="role">
                      Role <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                      id="role"
                      value={lead.role}
                      onChange={(e) => setLead((s) => ({ ...s, role: e.target.value }))}
                      className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                      placeholder="COO / Head of Operations"
                      autoComplete="organization-title"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-slate-700" htmlFor="message">
                      Message / notes
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={lead.message}
                      onChange={(e) => setLead((s) => ({ ...s, message: e.target.value }))}
                      className="mt-2 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/15"
                      placeholder="Screening workflow, where audit evidence breaks down, and what you want to monitor."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b5bdb]"
                  >
                    {isSubmitting ? 'Sending…' : 'Request Pilot'}
                  </button>
                  {submitSuccess ? (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900/80">
                      Request received. We’ll email you shortly to schedule a demo and confirm pilot scope.
                    </div>
                  ) : null}
                  {submitError ? (
                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-900/80">
                      {submitError}
                    </div>
                  ) : null}
                  <div className="text-[12px] text-slate-500">
                    We’ll respond with a short agenda and pilot scope.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* 9. Footer */}
        <footer className="border-t border-slate-200/70 bg-[#f7f7f5]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex size-8 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70">
                    <span className="size-2.5 rounded-full bg-[#3b5bdb]" />
                  </span>
                  <div className="text-sm font-semibold text-slate-900">SignalLayer</div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  AI risk intelligence for property operations.
                </div>
              </div>

              <div className="text-sm">
                <div className="font-semibold text-slate-900">Navigate</div>
                <div className="mt-3 grid gap-2 text-slate-600">
                  {navItems.map((item) => (
                    <a key={item.href} className="transition hover:text-slate-900" href={item.href}>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="text-sm">
                <div className="font-semibold text-slate-900">Contact</div>
                <div className="mt-3 text-slate-600">
                  <a className="underline underline-offset-4 hover:text-slate-900" href="mailto:hello@signallayer.ai">
                    hello@signallayer.ai
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} SignalLayer</div>
              <div>Independent risk layer for AI-assisted screening workflows</div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
