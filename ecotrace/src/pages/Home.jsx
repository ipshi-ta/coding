import { Link } from 'react-router-dom'; import { motion } from 'framer-motion'
import { ScanLine, Recycle, Sprout, MapPin, History, Lightbulb, Cloud, Camera, Search, Leaf } from 'lucide-react'
const features = [[ScanLine,'AI Waste Scanner','Photograph an item and get guidance from the backend model.','/scan'],[Recycle,'Smart Segregation','Wet, dry or special waste, explained.','/scan'],[Sprout,'Composting Guide','What can go in your compost, and how.','/composting'],[MapPin,'Recycling Locator','Find verified recyclers on a map.','/recyclers'],[History,'Waste History','Review and edit what you have recorded.','/history'],[Lightbulb,'Sustainable Alternatives','Swaps based on your own records.','/alternatives'],[Cloud,'Carbon Footprint Estimator','Estimate waste-related kg CO₂e.','/carbon']]
export default function Home() {
  return <>
    <section className="bg-gradient-to-br from-forest via-emerald to-sage px-4 py-24 text-cream">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center">
        <p className="mb-3 font-label text-sun">Scan Smart. Waste Less. Live Greener.</p>
        <h1 className="text-4xl md:text-6xl">Your Waste Has a Story. EcoTrace Helps You Understand It.</h1>
        <p className="mx-auto mt-5 max-w-2xl opacity-90">Identify waste, discover better disposal options, track your habits, and make more sustainable choices.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/scan" className="btn !bg-sun !text-forest"><Camera size={18} />Scan Waste</Link>
          <Link to="/dashboard" className="btn-alt !border-cream !text-cream hover:!bg-cream hover:!text-forest">Explore Dashboard</Link>
          <a href="#how" className="btn-alt !border-cream !text-cream hover:!bg-cream hover:!text-forest">Learn About EcoTrace</a>
        </div></motion.div></section>
    <section className="mx-auto max-w-6xl px-4 py-16"><h2 className="mb-8 text-center text-3xl">Everything in one place</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{features.map(([I, t, d, to], i) =>
        <motion.div key={t} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
          <Link to={to} className="card block h-full"><I className="mb-3 text-emerald" size={30} /><h3 className="text-xl">{t}</h3><p className="mt-1 text-sm opacity-80">{d}</p></Link></motion.div>)}</div></section>
    <section id="how" className="bg-white px-4 py-16"><div className="mx-auto max-w-5xl"><h2 className="mb-8 text-center text-3xl">How it works</h2>
      <div className="grid gap-6 md:grid-cols-3">{[[Camera,'1. Scan','Take or upload a photo of a single item.'],[Search,'2. Understand','See category, recyclability and disposal steps.'],[Leaf,'3. Improve','Save to history, track habits, adopt greener swaps.']].map(([I, t, d]) =>
        <div key={t} className="card text-center"><I className="mx-auto mb-3 text-emerald" size={32} /><h3 className="text-xl">{t}</h3><p className="text-sm opacity-80">{d}</p></div>)}</div></div></section>
  </>
}
