import { useState } from 'react'; import { Page } from '../components/ui'
const ITEMS = [['Vegetable and fruit scraps', 'yes', 'Green material; chop small.'], ['Coffee grounds and tea bags', 'yes', 'Check bags are plastic-free.'], ['Eggshells', 'yes', 'Crush first.'], ['Dry leaves and cardboard', 'yes', 'Brown material; balances moisture.'], ['Meat and fish', 'no', 'Attracts pests and smells.'], ['Dairy', 'no', 'Attracts pests and smells.'], ['Oils and greasy food', 'no', 'Slows breakdown.'], ['Citrus and onion', 'limit', 'Small amounts only.'], ['Pet waste', 'no', 'Can carry pathogens.']]
const tone = { yes: 'bg-emerald/15 text-emerald', no: 'bg-red-100 text-red-800', limit: 'bg-sun text-forest' }
const lab = { yes: 'Suitable', no: 'Not suitable', limit: 'In moderation' }
export default function Composting() {
  const [q, setQ] = useState('')
  return <Page title="Composting Guide" sub="General home-composting guidance. Local rules and conditions vary.">
    <input className="input w-full" placeholder="Search an organic item (e.g. eggshell)" value={q} onChange={e => setQ(e.target.value)} />
    <div className="grid gap-3 sm:grid-cols-2">{ITEMS.filter(i => i[0].toLowerCase().includes(q.toLowerCase())).map(([n, s, d]) => <div key={n} className="card !p-4"><div className="flex justify-between gap-2"><b>{n}</b><span className={`rounded-full px-2 text-xs ${tone[s]}`}>{lab[s]}</span></div><p className="mt-1 text-sm opacity-80">{d}</p></div>)}</div>
    <div className="grid gap-5 md:grid-cols-3">
      <div className="card"><h3 className="text-xl">Steps</h3><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm"><li>Pick a bin or spot with drainage.</li><li>Layer browns (dry) and greens (wet).</li><li>Keep it damp like a wrung sponge.</li><li>Turn every week or two.</li><li>Use when dark and crumbly.</li></ol></div>
      <div className="card"><h3 className="text-xl">Common mistakes</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><li>Too many greens</li><li>Adding meat or dairy</li><li>Never turning the pile</li><li>Letting it dry out</li></ul></div>
      <div className="card"><h3 className="text-xl">Troubleshooting</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm"><li>Smelly: add browns, turn it.</li><li>Too dry: add water and greens.</li><li>Too wet: add browns, improve drainage.</li><li>Flies: bury fresh scraps.</li></ul></div></div></Page>
}
