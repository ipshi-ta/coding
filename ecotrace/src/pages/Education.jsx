import { useState } from 'react'; import { Page } from '../components/ui'
const TOPICS = [['Waste segregation awareness', 'Separate wet, dry and special waste at source.'], ['School workshops', 'Planned: hands-on sorting sessions for schools.'], ['College sustainability programs', 'Planned: campus audits and student-led drives.'], ['Home composting education', 'Planned: demonstrations of small-scale composting.'], ['Community recycling awareness', 'Planned: neighbourhood awareness sessions.']]
const Q = [['Where does a banana peel go?', ['Wet / compost', 'Dry waste', 'Special waste'], 0], ['Where do used batteries go?', ['Wet waste', 'Special / e-waste collection', 'Compost'], 1], ['Where does a clean paper sheet go?', ['Dry waste (recyclable)', 'Wet waste', 'Special waste'], 0], ['Where does vegetable scrap go?', ['Dry waste', 'Special waste', 'Wet / compost'], 2]]
export default function Education() {
  const [i, setI] = useState(0); const [score, setScore] = useState(0); const [pick, setPick] = useState(null)
  const done = i >= Q.length
  const next = () => { if (pick === Q[i][2]) setScore(s => s + 1); setPick(null); setI(i + 1) }
  return <Page title="Education and Workshops" sub="Workshops listed here are planned. No real events are scheduled yet.">
    <div className="grid gap-4 md:grid-cols-2">{TOPICS.map(([t, d]) => <div key={t} className="card"><h3 className="text-xl">{t}</h3><p className="text-sm opacity-80">{d}</p></div>)}</div>
    <div className="card"><h2 className="mb-3 text-2xl">Waste-sorting quiz</h2>
      {done ? <div><p className="text-lg">You scored {score + (pick === Q[Q.length - 1]?.[2] ? 0 : 0)} / {Q.length}</p><button className="btn mt-3" onClick={() => { setI(0); setScore(0); setPick(null) }}>Play again</button></div> :
        <div><p className="font-medium">{Q[i][0]}</p><div className="mt-3 flex flex-wrap gap-2">{Q[i][1].map((o, k) => <button key={o} onClick={() => setPick(k)} className={pick === k ? (k === Q[i][2] ? 'btn' : 'btn !bg-red-600') : 'btn-alt'}>{o}</button>)}</div>
          {pick !== null && <div className="mt-3"><p className="text-sm">{pick === Q[i][2] ? 'Correct!' : `Not quite. Answer: ${Q[i][1][Q[i][2]]}`}</p><button className="btn mt-2" onClick={next}>Next</button></div>}</div>}</div></Page>
}
