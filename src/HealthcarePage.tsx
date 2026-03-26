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
      setLead({ name: '', email: '', company: '', role: '', message: '' })
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

          <p className="mt-5 text-lg text-slate-600">
            SignalLayer scores every claim for{' '}
            <span className="font-semibold text-slate-900">audit defensibility before submission</span>
            {' '}— so provider organizations don’t book revenue that gets denied, clawed back, or challenged later.
          </p>

          <p className="mt-4 text-sm text-slate-700 font-medium">
            Built for provider organizations, revenue cycle teams, and risk-bearing care groups managing audit exposure across complex claims.
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Reduce audit-related clawbacks and downstream denial exposure before claims leave your workflow.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Payers are increasing scrutiny on diagnosis support, medical necessity, and documentation integrity — most teams still find risk after submission.
          </p>

          <div className="mt-8 flex gap-3">
            <a href="#contact" className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold">
              Analyze Your Claims
            </a>
            <a href="#how-it-works" className="border px-4 py-2 rounded-md text-sm font-semibold bg-white">
              See How It Works
            </a>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            6 claims flagged · Estimated reimbursement at risk:{' '}
            <span className="font-semibold text-slate-900">$42,300</span>
          </div>
        </div>

        <div className="mt-10 md:mt-0 border rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">
            High-Risk Claim Queue
          </div>

          {decisions.map((d) => (
            <div key={d.id} className="border rounded-lg p-3 mb-2 bg-slate-50">
              <div className="flex justify-between text-sm font-medium">
                <span>{d.id}</span>
                <span className={d.level === 'High Risk' ? 'text-red-600' : 'text-amber-600'}>
                  {d.level}
                </span>
              </div>
              <div className="text-xs text-slate-600 mt-1">{d.reason}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DEFENSIBILITY EXPLANATION */}
      <section className="border-t py-10">
        <div className="max-w-4xl mx-auto px-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Defensibility Score:</span>{' '}
          A 0–100 score based on documentation sufficiency, MEAT completeness, medical necessity support, and historical denial patterns.
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-t py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            You’re capturing revenue you may not be able to defend.
          </h2>

          <div className="mt-6 grid md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="border rounded p-4 bg-white">Diagnoses billed without sufficient clinical support</div>
            <div className="border rounded p-4 bg-white">Medical necessity assumed, not documented</div>
            <div className="border rounded p-4 bg-white">Condition evidence spread across notes, labs, and meds</div>
            <div className="border rounded p-4 bg-white">Denial and audit risk discovered too late</div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Most teams optimize for coding completeness and throughput. Few have a system that asks whether the claim will actually hold up under scrutiny.
          </p>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="how-it-works" className="border-t py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">Insert a defensibility check before claim submission.</h2>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">1. Connect clinical + claim inputs</div>
              <div className="text-sm text-slate-600 mt-2">
                Pull from EHR exports, CCDAs, encounter notes, coding outputs, and billing workflows.
              </div>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">2. Score defensibility</div>
              <div className="text-sm text-slate-600 mt-2">
                Evaluate evidence sufficiency, MEAT completeness, documentation integrity, medical necessity, and known denial patterns.
              </div>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">3. Fix before submission</div>
              <div className="text-sm text-slate-600 mt-2">
                Route issues to coding, CDI, or revenue integrity teams while documentation is still actionable.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEFENSIBILITY ENGINE */}
      <section className="border-t py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Every claim comes with audit-ready justification.
              </h2>

              <p className="mt-4 text-slate-600 max-w-2xl">
                SignalLayer doesn’t just flag issues. It generates a defensible record for every submitted claim, with evidence mapping, documentation review, and a clear rationale for why a claim should or should not be submitted.
              </p>

              <div className="mt-8 border rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold">Claim #4821 — Type 2 Diabetes with complication</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Status: <span className="font-semibold text-red-600">Not defensible</span>
                    </div>
                  </div>

                  <div className="border rounded-lg bg-red-50 border-red-200 px-4 py-3 min-w-[170px]">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Defensibility Score</div>
                    <div className="text-2xl font-semibold text-red-600 mt-1">62%</div>
                    <div className="text-xs text-slate-500">Audit threshold: 75%</div>
                  </div>
                </div>

                <div className="mt-8 grid sm:grid-cols-2 gap-3">
                  {scoreBreakdown.map((item) => (
                    <div key={item.label} className="border rounded-lg p-4 bg-slate-50">
                      <div className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="font-semibold text-sm">Evidence Mapping</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li>✅ Medication supports active treatment</li>
                      <li>✅ Lab values support disease presence</li>
                      <li>❌ No explicit clinician assessment of complication severity</li>
                      <li>⚠️ Problem list and encounter note are not fully aligned</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-semibold text-sm">Why this fails audit</div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li>Severity billed is not directly supported in physician documentation</li>
                      <li>Documentation does not clearly establish ongoing evaluation/assessment</li>
                      <li>Claim carries elevated denial risk due to insufficient specificity</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Financial Exposure</div>
                    <div className="mt-2 text-sm text-slate-600">Estimated reimbursement: $3,200</div>
                    <div className="text-sm text-slate-600">Downstream denial risk: elevated</div>
                    <div className="text-sm font-semibold text-red-600 mt-1">Revenue at risk: High</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-slate-50">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Recommended Fix</div>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      <li>Add explicit clinician assessment of condition severity</li>
                      <li>Document monitoring/evaluation in the encounter note</li>
                      <li>Align diagnosis specificity with chart support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-xl bg-white p-6 shadow-sm h-fit">
              <div className="font-semibold text-sm">Audit Report (Auto-Generated)</div>

              <div className="mt-6 space-y-5 text-sm text-slate-600">
                <div>
                  <div className="font-semibold text-slate-900">Condition</div>
                  <div>Type 2 Diabetes with complication</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Status</div>
                  <div className="font-semibold text-red-600">Do not submit</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Supporting documentation</div>
                  <div>Medication list and labs linked</div>
                  <div>Insufficient clinician assessment supporting billed specificity</div>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Defensibility rationale</div>
                  <p className="mt-1 leading-6">
                    Documentation supports disease presence but does not adequately justify the billed specificity and ongoing clinical assessment required to defend the claim under audit.
                  </p>
                </div>

                <div>
                  <div className="font-semibold text-slate-900">Recommendation</div>
                  <div>Hold claim until documentation is completed or coding is adjusted to match chart support.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHIFT */}
      <section className="border-t py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            From coding optimization to reimbursement defensibility
          </h2>

          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">Old way</div>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>Code for completeness and submit</li>
                <li>Denials and audits handled after the fact</li>
                <li>No clear defensibility threshold</li>
                <li>Revenue integrity teams find risk too late</li>
              </ul>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">With SignalLayer</div>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>Score defensibility before submission</li>
                <li>Hold claims that won’t withstand scrutiny</li>
                <li>Generate audit-ready justification</li>
                <li>Create a system of record for why claims were submitted</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-lg font-semibold">
            <strong>SignalLayer — Reimbursement Defensibility Engine</strong>
          </div>
          <div className="mt-2 text-slate-600">
            We don’t just find revenue. We help ensure it holds up under audit.
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t py-10 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-600">
          Built by healthcare product leaders with experience across revenue cycle, clinical workflows, structured documentation, and AI-powered claim review.
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="border-t py-14">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center">
            Catch audit risk before submission.
          </h2>

          <p className="mt-3 text-center text-sm text-slate-600">
            See how SignalLayer identifies documentation and coding risk before claims are sent out.
          </p>

          <form onSubmit={submitLead} className="mt-6 space-y-4">
            <input
              placeholder="Full name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="Work email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
            <input
              placeholder="Company"
              value={lead.company}
              onChange={(e) => setLead({ ...lead, company: e.target.value })}
              className="w-full border rounded px-3 py-2"
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