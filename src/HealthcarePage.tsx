import { useMemo, useState } from 'react'

function HealthcarePage() {
  const decisions = [
    { id: 'Claim #4821', level: 'High Risk', reason: 'Diagnosis lacks sufficient support in physician documentation' },
    { id: 'Claim #4814', level: 'High Risk', reason: 'Medical necessity not adequately supported' },
    { id: 'Claim #4809', level: 'Review', reason: 'Condition inferred from meds/labs but not explicitly documented' },
    { id: 'Claim #4802', level: 'High Risk', reason: 'Coding inconsistency vs clinical notes' },
    { id: 'Claim #4794', level: 'Review', reason: 'Missing evidence required to support billed severity' },
  ] as const

  const scoreBreakdown = [
    { label: 'Evidence sufficiency', value: '70%' },
    { label: 'MEAT completeness', value: '50%' },
    { label: 'Documentation integrity', value: '80%' },
    { label: 'Historical denial risk', value: 'High' },
  ] as const

  const [lead, setLead] = useState({
    name: '',
    email: '',
    company: '',
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
  }, [lead])

  async function submitLead(e: React.FormEvent) {
    e.preventDefault()
    setSubmitSuccess(false)
    setSubmitError(null)

    if (Object.keys(fieldErrors).length) {
      setSubmitError('Please complete the required fields.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      })

      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Submission failed')
      }

      setSubmitSuccess(true)
      setLead({ name: '', email: '', company: '' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#f7f7f5] text-slate-900">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 md:grid md:grid-cols-2 md:gap-12 md:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Only submit revenue you can defend.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Score every claim for audit defensibility before submission — so you don’t book revenue that gets denied or clawed back.
          </p>

          <p className="mt-4 text-base text-slate-600">
            Built for revenue cycle, coding, and clinical documentation teams.
          </p>

          <div className="mt-8 flex gap-3">
            <a
              href="#contact"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Analyze Your Claims
            </a>
            <a
              href="#how-it-works"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            6 claims flagged · Estimated reimbursement at risk:{' '}
            <span className="font-semibold text-slate-900">$42,300</span>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:mt-0">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            High-Risk Claim Queue
          </div>

          <div className="space-y-3">
            {decisions.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex justify-between text-sm font-medium">
                  <span>{d.id}</span>
                  <span className={d.level === 'High Risk' ? 'text-red-600' : 'text-amber-600'}>
                    {d.level}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-600">{d.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

 {/* WHY THIS MATTERS */}
<section className="border-t border-slate-200 py-4">
  <div className="mx-auto max-w-6xl px-4 sm:px-6">
    <div className="max-w-4xl">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Why this matters
      </div>

      <p className="mt-3 text-[2rem] font-medium leading-[1.35] text-slate-800">
        Most teams optimize claims for coding completeness, not whether the documentation will actually hold up under scrutiny.
      </p>

  
    </div>
  </div>
</section>

      {/* PROBLEM */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            The gap isn’t coding — it’s defensibility.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">
                Inferred diagnoses
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Conditions are supported indirectly through meds, labs, or problem lists — not explicit clinician documentation.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">
                Medical necessity gaps
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The chart implies the right story, but doesn’t clearly document why billed care or severity is justified.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">
                Evidence spread across the chart
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Notes, labs, and meds may each help — but they are not tied together into something auditable.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-semibold text-slate-900">
                Risk found too late
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Denials and clawbacks surface after submission, when revenue is already booked and harder to defend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">How it works</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">1. Connect</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Pull in EHR, CCDA, coding, and billing inputs so claims and documentation are reviewed together.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">2. Score defensibility</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Evaluate evidence sufficiency, MEAT completeness, medical necessity support, and denial patterns.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">3. Fix before submission</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Route issues to coding, CDI, or documentation teams while the record is still actionable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT PROOF */}
      <section className="border-t border-slate-200 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-semibold mb-8">
            Every flagged claim comes with a clear rationale
          </h2>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Claim #4821 — Type 2 Diabetes with complication
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Status: <span className="font-semibold text-red-600">Not defensible</span>
                  </div>
                </div>

                <div className="min-w-[170px] rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Defensibility Score
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-red-600">62%</div>
                  <div className="text-xs text-slate-500">Audit threshold: 75%</div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {scoreBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-2 text-base font-semibold text-slate-900">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Evidence mapping</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    <li>✅ Medication supports active treatment</li>
                    <li>✅ Lab values support disease presence</li>
                    <li>❌ No explicit clinician assessment of complication severity</li>
                    <li>⚠️ Problem list and encounter note are not fully aligned</li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-slate-900">Why this fails</div>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    <li>Severity billed is not directly supported in physician documentation</li>
                    <li>Ongoing assessment is not clearly established in the chart</li>
                    <li>Claim carries elevated denial risk due to insufficient specificity</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Financial Exposure
                  </div>
                  <div className="mt-2 text-sm text-slate-600">Estimated reimbursement: $3,200</div>
                  <div className="text-sm text-slate-600">Downstream denial risk: elevated</div>
                  <div className="mt-1 text-sm font-semibold text-red-600">Revenue at risk: High</div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Recommended Fix
                  </div>
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600">
                    <li>Add explicit clinician assessment of condition severity</li>
                    <li>Document monitoring or evaluation in the encounter note</li>
                    <li>Align diagnosis specificity with chart support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="font-semibold text-sm text-slate-900">
                Audit Report (Auto-Generated)
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>
                  <div className="font-semibold text-slate-900">Condition</div>
                  <div>Type 2 Diabetes with complication</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Status</div>
                  <div className="text-red-600 font-semibold">Do not submit</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Supporting documentation</div>
                  <div>Medication list and labs linked</div>
                  <div>Insufficient clinician assessment supporting billed specificity</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Defensibility rationale</div>
                  <p>
                    Documentation supports disease presence but does not adequately justify the billed specificity and ongoing clinical assessment required to defend the claim under audit.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Recommendation</div>
                  <p>Hold claim until documentation is completed or coding is adjusted to match chart support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="border-t py-14">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-semibold">
            Catch audit risk before submission.
          </h2>

          <form onSubmit={submitLead} className="mt-6 space-y-4">
            <input
              placeholder="Name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              placeholder="Email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              placeholder="Company"
              value={lead.company}
              onChange={(e) => setLead({ ...lead, company: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            />

            <button className="bg-slate-900 text-white px-4 py-2 rounded">
              {isSubmitting ? 'Sending…' : 'Analyze My Claims'}
            </button>

            {submitSuccess && <div className="text-green-600 text-sm">Submitted successfully</div>}
            {submitError && <div className="text-red-600 text-sm">{submitError}</div>}
          </form>
        </div>
      </section>
    </div>
  )
}

export default HealthcarePage