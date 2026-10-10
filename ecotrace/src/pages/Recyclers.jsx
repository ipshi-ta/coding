import { useEffect, useState } from 'react'; import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'; import { LocateFixed, Search, ExternalLink } from 'lucide-react'
import { api } from '../lib/api'; import { Page, Loading, ErrorBox, Empty } from '../components/ui'
L.Icon.Default.mergeOptions({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' })
const Fly = ({ c }) => { const m = useMap(); useEffect(() => { m.setView(c, 12) }, [c]); return null }
export default function Recyclers() {
  const [c, setC] = useState([20.59, 78.96]); const [city, setCity] = useState(''); const [mat, setMat] = useState('all')
  const [list, setList] = useState(null); const [busy, setBusy] = useState(false); const [err, setErr] = useState(null)
  const load = async (pos, cityName) => {
    setBusy(true); setErr(null)
    try { const p = { lat: pos[0], lng: pos[1] }; if (cityName) p.city = cityName; if (mat !== 'all') p.material = mat; const d = await api.recyclers(p); setList(d.items || d) }
    catch (e) { setErr(e.message); setList(null) } finally { setBusy(false) }
  }
  const locate = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition(p => { const x = [p.coords.latitude, p.coords.longitude]; setC(x); load(x) }, () => setErr('Location permission denied. Search by city instead.')) : setErr('Geolocation is not supported. Search by city instead.')
  const search = async e => {
    e.preventDefault(); if (!city.trim()) return; setErr(null)
    try { const r = await (await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(city))).json()
      if (!r[0]) return setErr('City not found.'); const x = [+r[0].lat, +r[0].lon]; setC(x); load(x, city) } catch { setErr('City search failed. Check your connection.') }
  }
  return <Page title="Recycling Locator" sub="Only verified recyclers returned by the backend are listed.">
    <div className="flex flex-wrap gap-3"><button className="btn" onClick={locate}><LocateFixed size={18} />Use my location</button>
      <form onSubmit={search} className="flex gap-2"><input className="input" placeholder="Search a city" value={city} onChange={e => setCity(e.target.value)} /><button className="btn-alt"><Search size={18} />Search</button></form>
      <select className="input" value={mat} onChange={e => setMat(e.target.value)}>{['all', 'plastic', 'paper', 'glass', 'metal', 'e-waste', 'organic'].map(m => <option key={m}>{m}</option>)}</select></div>
    {err && <ErrorBox message={err} />}
    <div className="h-96 overflow-hidden rounded-2xl"><MapContainer center={c} zoom={5} className="h-full"><TileLayer attribution="© OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" /><Fly c={c} />
      {(list || []).filter(r => r.lat && r.lng).map(r => <Marker key={r.id || r.name} position={[r.lat, r.lng]}><Popup>{r.name}</Popup></Marker>)}</MapContainer></div>
    {busy ? <Loading /> : list && !list.length ? <Empty title="No verified recyclers found" text="We will not invent results. Try another city or material, or search your local municipality's website." /> :
      <div className="grid gap-4 md:grid-cols-2">{(list || []).map(r => <div key={r.id || r.name} className="card"><h3 className="text-xl">{r.name}</h3><p className="text-sm">{r.address}</p>
        {r.accepted_materials?.length > 0 && <p className="mt-1 text-sm"><b>Accepts:</b> {r.accepted_materials.join(', ')}</p>}
        <a className="mt-2 inline-flex items-center gap-1 text-sm text-emerald underline" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/directions?to=${r.lat}%2C${r.lng}`}>Directions <ExternalLink size={14} /></a></div>)}</div>}
  </Page>
}
