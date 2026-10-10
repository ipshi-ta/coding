import { useState } from 'react'; import { NavLink, Link } from 'react-router-dom'; import { Leaf, Menu, X } from 'lucide-react'
export const links = [['/', 'Home'], ['/scan', 'Scan Waste'], ['/dashboard', 'Dashboard'], ['/history', 'History'], ['/recyclers', 'Recyclers'], ['/composting', 'Composting'], ['/alternatives', 'Alternatives'], ['/carbon', 'Carbon Impact'], ['/education', 'Education']]
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const cls = ({ isActive }) => `rounded-full px-3 py-1.5 text-sm font-label ${isActive ? 'bg-emerald text-white' : 'hover:bg-sage/30'}`
  return <header className="sticky top-0 z-[1000] border-b border-sage/30 bg-cream/90 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link to="/" className="flex items-center gap-2 font-display text-2xl text-forest"><Leaf className="text-emerald" />EcoTrace</Link>
      <nav className="hidden gap-1 lg:flex">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}</nav>
      <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="flex flex-col gap-1 px-4 pb-4 lg:hidden" onClick={() => setOpen(false)}>{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}</nav>}
  </header>
}
