import { useState, useMemo } from 'react'; import { Trash2, Pencil, Search } from 'lucide-react'
import useHistory from '../lib/useHistory'; import { api, demoStore } from '../lib/api'; import { Page, Loading, ErrorBox, Empty } from '../components/ui'
export default function History() {
  const { items, loading, demo, error, reload } = useHistory(); const [q, setQ] = useState(''); const [cat, setCat] = useState('all'); const [view, setView] = useState('all'); const [msg, setMsg] = useState(null)
  const cats = useMemo(() => [...new Set(items.map(i => i.category).filter(Boolean))], [items])
  const rows = useMemo(() => {
    const days = { week: 7, month: 30 }[view]; const cutoff = days ? Date.now() - days * 864e5 : 0
    return items.filter(i => (cat === 'all' || i.category === cat) && i.item?.toLowerCase().includes(q.toLowerCase()) && new Date(i.date) >= cutoff)
  }, [items, q, cat, view])
  const del = async id => { try { demo ? demoStore.save(demoStore.all().filter(x => x.id !== id)) : await api.deleteHistory(id); reload() } catch (e) { setMsg(e.message) } }
  const edit = async i => {
    const item = prompt('Item name', i.item); if (!item) return
    const quantity = Number(prompt('Quantity', i.quantity)) || i.quantity
    try { demo ? demoStore.save(demoStore.all().map(x => x.id === i.id ? { ...x, item, quantity } : x)) : await api.updateHistory(i.id, { item, quantity }); reload() } catch (e) { setMsg(e.message) }
  }
  return <Page title="Waste History" sub="Everything you have confirmed and saved.">
    {error && <ErrorBox message={error} demo={demo} />}{msg && <ErrorBox message={msg} />}
    <div className="flex flex-wrap gap-3"><div className="relative"><Search className="absolute left-3 top-2.5 opacity-50" size={16} /><input className="input pl-9" placeholder="Search items" value={q} onChange={e => setQ(e.target.value)} /></div>
      <select className="input" value={cat} onChange={e => setCat(e.target.value)}><option value="all">All categories</option>{cats.map(c => <option key={c}>{c}</option>)}</select>
      <select className="input" value={view} onChange={e => setView(e.target.value)}><option value="all">All time</option><option value="week">Past week</option><option value="month">Past month</option></select></div>
    {loading ? <Loading /> : !items.length ? <Empty title="No history yet" text="Scan an item and save it to start building your record." to="/scan" cta="Scan Waste" /> :
      <div className="card overflow-x-auto !p-0"><table className="w-full text-left text-sm"><thead className="bg-sage/20 font-label"><tr>{['Date', 'Item', 'Category', 'Qty', 'Disposal', ''].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
        <tbody>{rows.map(i => <tr key={i.id} className="border-t border-sage/20"><td className="p-3">{new Date(i.date).toLocaleDateString()}</td><td className="p-3">{i.item}</td><td className="p-3">{i.category}</td><td className="p-3">{i.quantity}</td><td className="p-3">{i.disposal ?? i.instructions ?? '—'}</td>
          <td className="flex gap-2 p-3"><button aria-label="Edit" onClick={() => edit(i)}><Pencil size={16} /></button><button aria-label="Delete" onClick={() => del(i.id)}><Trash2 size={16} /></button></td></tr>)}</tbody></table>
        {!rows.length && <p className="p-4 text-sm">No records match your filters.</p>}</div>}
  </Page>
}
