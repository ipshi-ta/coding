import { useMemo } from 'react'; import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import useHistory from '../lib/useHistory'; import { Page, Loading, ErrorBox, Empty } from '../components/ui'
const COLORS = ['#12372A', '#2D6A4F', '#A3B18A', '#F6E7A1', '#74A57F']
const count = (arr, f) => Object.entries(arr.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + (x.quantity || 1); return a }, {})).map(([name, value]) => ({ name, value }))
const week = d => { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); return x.toISOString().slice(5, 10) }
const month = d => new Date(d).toISOString().slice(0, 7)
const Box = ({ t, children }) => <div className="card"><h3 className="mb-3 text-lg">{t}</h3><div className="h-64">{children}</div></div>
export default function Dashboard() {
  const { items, loading, demo, error } = useHistory()
  const d = useMemo(() => {
    const sort = k => (a, b) => a[k] < b[k] ? -1 : 1
    return { total: items.reduce((s, i) => s + (i.quantity || 1), 0), cats: count(items, i => i.category || 'Unknown'),
      top: count(items, i => i.item).sort((a, b) => b.value - a.value).slice(0, 5),
      weekly: count(items, i => week(i.date)).sort(sort('name')), monthly: count(items, i => month(i.date)).sort(sort('name')) }
  }, [items])
  if (loading) return <Page title="Dashboard"><Loading /></Page>
  return <Page title="Analytics Dashboard" sub="Built only from your saved records.">
    {error && <ErrorBox message={error} demo={demo} />}
    {!items.length ? <Empty title="Nothing to chart yet" text="Scan waste and save results. Your charts will appear here." to="/scan" cta="Scan Waste" /> : <>
      <div className="card text-center"><div className="font-label text-sm opacity-70">Total confirmed items</div><div className="font-display text-5xl text-emerald">{d.total}</div></div>
      <div className="grid gap-6 md:grid-cols-2">
        <Box t="Category distribution (pie)"><ResponsiveContainer><PieChart><Pie data={d.cats} dataKey="value" nameKey="name" outerRadius={90}>{d.cats.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></Box>
        <Box t="Category share (doughnut)"><ResponsiveContainer><PieChart><Pie data={d.cats} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>{d.cats.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></Box>
        <Box t="Most frequently recorded items"><ResponsiveContainer><BarChart data={d.top}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2D6A4F" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Box>
        <Box t="Weekly trend (week starting MM-DD)"><ResponsiveContainer><LineChart data={d.weekly}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="value" stroke="#12372A" strokeWidth={3} /></LineChart></ResponsiveContainer></Box>
        <Box t="Monthly trend"><ResponsiveContainer><LineChart data={d.monthly}><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="value" stroke="#2D6A4F" strokeWidth={3} /></LineChart></ResponsiveContainer></Box></div>
      <div className="card"><h3 className="text-lg">Personalised recommendations</h3><p className="text-sm opacity-80">See swaps matched to your records on the <a className="underline" href="/alternatives">Alternatives</a> page.</p></div></>}
  </Page>
}
