import { useState, useMemo } from 'react'; import { CheckCircle2 } from 'lucide-react'
import useHistory from '../lib/useHistory'; import { Page, ErrorBox } from '../components/ui'
const ALTS = [
 { key: 'bottle', from: 'Plastic bottles', to: 'Refillable steel bottle', why: 'Replaces many single-use bottles over its life.', note: 'Needs regular washing; check where you can refill.' },
 { key: 'sachet', from: 'Coffee sachets', to: 'Larger package or refill container', why: 'Less packaging per serving.', note: 'Only helps if you finish it before it goes stale.' },
 { key: 'cup', from: 'Disposable cups', to: 'Reusable cup', why: 'Cuts repeat single-use waste.', note: 'Carry and wash it; some cafés give a discount.' },
 { key: 'bag', from: 'Plastic bags', to: 'Reusable shopping bag', why: 'One bag can replace many.', note: 'Reuse it consistently for the benefit to show.' },
 { key: 'food', from: 'Food scraps', to: 'Food-waste prevention and suitable composting', why: 'Buying and storing smarter avoids waste; compost what remains.', note: 'Meat, dairy and oily food usually do not suit home composting.' }]
const KEY = 'ecotrace_adopted'
export default function Alternatives() {
  const { items, demo, error } = useHistory()
  const [adopted, setAdopted] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } })
  const toggle = k => { const n = adopted.includes(k) ? adopted.filter(x => x !== k) : [...adopted, k]; setAdopted(n); localStorage.setItem(KEY, JSON.stringify(n)) }
  const text = useMemo(() => items.map(i => (i.item || '').toLowerCase()).join(' '), [items])
  const match = a => text.includes(a.from.split(' ')[1]?.slice(0, 4).toLowerCase()) || (a.key === 'food' && /food|peel|scrap/.test(text))
  return <Page title="Sustainable Alternatives" sub="Suggestions marked 'Matches your records' are based on items you have saved.">
    {error && <ErrorBox message={error} demo={demo} />}
    <div className="grid gap-5 md:grid-cols-2">{ALTS.map(a => <div key={a.key} className="card">
      {match(a) && <span className="mb-2 inline-block rounded-full bg-sun px-2 py-0.5 text-xs font-label">Matches your records</span>}
      <p className="text-sm opacity-70">Current habit: {a.from}</p><h3 className="text-xl">{a.to}</h3>
      <p className="mt-2 text-sm"><b>Why it may help:</b> {a.why}</p><p className="mt-1 text-sm"><b>Consider:</b> {a.note}</p>
      <button onClick={() => toggle(a.key)} className={adopted.includes(a.key) ? 'btn mt-4' : 'btn-alt mt-4'}><CheckCircle2 size={18} />{adopted.includes(a.key) ? 'Adopted' : 'Mark as adopted'}</button></div>)}</div></Page>
}
