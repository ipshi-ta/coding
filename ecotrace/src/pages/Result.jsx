import { useLocation, Link, Navigate } from 'react-router-dom'; import { useEffect, useState } from 'react'
import { api, demoStore } from '../lib/api'; import { Page, ErrorBox } from '../components/ui'
const Row = ({ k, v }) => <div className="flex justify-between border-b border-sage/30 py-2 text-sm"><span className="font-label opacity-70">{k}</span><b className="text-right">{String(v ?? 'Not provided')}</b></div>
export default function Result() {
  const { state } = useLocation(); const [r, setR] = useState(state?.result); const [msg, setMsg] = useState(null); const [err, setErr] = useState(null); const [edit, setEdit] = useState(false); const [catalog, setCatalog] = useState([]); const [saving, setSaving] = useState(false)
  useEffect(() => { api.items().then(setCatalog).catch(e => setErr(e.message)) }, [])
  if (!r) return <Navigate to="/scan" />
  const chosen = catalog.find(x => x.item === r.item); const manual = r.status === 'manual_identification_required'
  const save = async () => {
    setErr(null)
    if (!chosen) { setErr('Please choose an item from the list first.'); return }
    setSaving(true)
    try { await api.confirm({ item: r.item, quantity: 1 }); setMsg('Saved to your history.') }
    catch (e) { setErr(e.message) } finally { setSaving(false) }
  }
  return <Page title="Scan Result">
    <div className="grid gap-6 md:grid-cols-2">
      {state.preview && <img src={state.preview} alt="Scanned" className="w-full rounded-2xl" />}
      <div className="card"><h2 className="text-3xl">{manual ? "Select the item in your photo" : `Detected: ${r.item}`}</h2>
        {manual && <p className="mt-2 text-sm">Automatic photo recognition is not connected yet. Choose the correct item to get real guidance and save it.</p>}
        <select className="input mt-3 w-full" value={r.item || ""} onChange={e => setR({ ...r, item: e.target.value })}><option value="">Choose waste item...</option>{catalog.map(x => <option key={x.item} value={x.item}>{x.item.replaceAll("_", " ")}</option>)}</select>
        <Row k="Material" v={r.material} /><Row k="Category" v={chosen?.category || r.category} /><Row k="Recyclability" v={r.recyclability ?? r.recyclable} />
        <Row k="Home composting" v={chosen ? (chosen.compostable ? "Generally suitable" : "Not recommended") : (r.compostable ?? r.home_compostable)} /><Row k="Confidence" v={r.confidence != null ? Math.round(r.confidence * 100) + '%' : null} />
        <p className="mt-3 text-sm"><b>Disposal:</b> {chosen?.disposal_guidance ?? r.instructions ?? r.disposal ?? 'Select an item to see guidance.'}</p>
        
        {msg && <p className="mt-3 text-sm font-medium text-emerald">{msg}</p>}{err && <div className="mt-2"><ErrorBox message={err} demo /></div>}
        <div className="mt-5 flex flex-wrap gap-3"><button className="btn" onClick={save} disabled={!chosen || saving || !!msg}>{saving ? "Saving..." : "Save to History"}</button>
          <Link to="/recyclers" className="btn-alt">Find Recycler</Link><Link to="/scan" className="btn-alt">Scan Again</Link></div></div></div></Page>
}
