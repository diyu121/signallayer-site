import { useMemo, useState } from 'react'

function HealthcarePage() {

  const decisions = [
    { id: 'Claim #4821', level: 'High Risk', reason: 'Missing physician attestation + MEAT criteria not met' },
    { id: 'Claim #4814', level: 'High Risk', reason: 'Medical necessity not supported' },
    { id: 'Claim #4809', level: 'Review', reason: 'Diagnosis not supported by documentation' },
    { id: 'Claim #4802', level: 'High Risk', reason: 'Coding inconsistency vs clinical notes' },
    { id: 'Claim #4794', level: 'Review', reason: 'Missing required elements (ADLs, skilled care)' },
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
            You’re submitting claims that won’t survive audit.
          </h1>

          <p className="mt-5 text-lg text-slate-600">
            SignalLayer flags documentation gaps, coding inconsistencies, and MEAT failures before submission—so you fix them before the clawback.
          </p>

          <div className="mt-8 flex gap-3">
            <a href="#contact" className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold">
              Request Pilot
            </a>
            <a href="#how-it-works" className="border px-4 py-2 rounded-md text-sm font-semibold">
              See How It Works
            </a>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            6 claims flagged · Estimated clawback exposure: <span className="font-semibold">$42,300</span>
          </div>
        </div>

        <div className="mt-10 md:mt-0 border rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-3">High-Risk Claim Queue</div>

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

          <div className="mt-3 p-3 border rounded bg-red-50 text-red-800 text-xs">
            <span className="font-semibold">Example:</span> Claim #4821 will likely be denied due to missing attestation + unsupported severity.
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-t py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            You’re optimizing revenue on claims that will be taken back.
          </h2>

          <div className="mt-6 grid md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="border rounded p-4 bg-white">Documentation doesn’t support billed care</div>
            <div className="border rounded p-4 bg-white">Diagnoses assigned without MEAT validation</div>
            <div className="border rounded p-4 bg-white">Medical necessity assumed, not proven</div>
            <div className="border rounded p-4 bg-white">Audits hit months later when records are cold</div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="how-it-works" className="border-t py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">Fix risk before submission—not after.</h2>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">1. Connect</div>
              <div className="text-sm text-slate-600 mt-2">
                EHR, billing system, or file upload
              </div>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">2. Score</div>
              <div className="text-sm text-slate-600 mt-2">
                Each claim gets a clawback probability and audit risk factors
              </div>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">3. Fix before submission</div>
              <div className="text-sm text-slate-600 mt-2">
                Route issues to coders and clinicians before revenue is locked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SHIFT */}
      <section className="border-t py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            From reimbursement optimization to audit survival
          </h2>

          <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">Old way</div>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>Submit → hope → audit later</li>
                <li>Denials discovered too late</li>
                <li>No feedback loop</li>
              </ul>
            </div>

            <div className="border rounded p-5 bg-white">
              <div className="font-semibold">With SignalLayer</div>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>Score risk before submission</li>
                <li>Fix issues in real time</li>
                <li>Continuously learn from audits</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-lg font-semibold">
            <strong>SignalLayer — Audit Survival Check</strong>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="border-t py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold">
            Catch audit risk before submission.
          </h2>

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
              {isSubmitting ? 'Sending…' : 'Request Pilot'}
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