import { useEffect, useState } from 'react'; import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import useHistory from '../lib/useHistory'; import { api } from '../lib/api'; import { Page, Loading, ErrorBox, Empty } from '../components/ui'
export default function Carbon() {
  const { items, loading } = useHistory(); const [res, setRes] = useState(null); const [err, setErr] = useState(null); const [busy, setBusy] = useState(false)
  useEffect(() => { if (loading || !items.length) return; setBusy(true)
    api.carbon({ item: items[0].item, weight_kg: items[0].weight_kg || 1 }).then(setRes).catch(e => setErr(e.message)).finally(() => setBusy(false)) }, [loading, items])
  if (loading || busy) return <Page title="Carbon Impact"><Loading /></Page>
  const rows = res?.by_material ? Object.entries(res.by_material).map(([name, kg]) => ({ name, kg })) : []
  return <Page title="Carbon Impact" sub="Estimates come from backend calculations using documented emission factors.">
    {err && <ErrorBox message={err} />}
    {!items.length ? <Empty title="Not enough data" text="Save some scanned items so the backend has inputs to estimate from." to="/scan" cta="Scan Waste" /> :
     !res || res.total_kg_co2e == null ? <Empty title="No credible estimate available" text="The backend has not returned an estimate. We will not display invented carbon figures." /> : <>
      <div className="card text-center"><div className="font-label text-sm opacity-70">Estimated waste-related emissions</div><div className="font-display text-5xl text-emerald">{res.total_kg_co2e} kg CO₂e</div></div>
      {rows.length > 0 && <div className="card h-72"><ResponsiveContainer><BarChart data={rows}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="kg" fill="#2D6A4F" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>}
      {res.assumptions && <div className="card"><h3 className="text-lg">Assumptions</h3><p className="mt-1 text-sm">{Array.isArray(res.assumptions) ? res.assumptions.join(' ') : res.assumptions}</p></div>}</>}
  </Page>
}
