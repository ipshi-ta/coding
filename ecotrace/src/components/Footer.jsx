import { Link } from 'react-router-dom'; import { links } from './Navbar'
export default () => <footer className="mt-16 bg-forest px-4 py-10 text-cream"><div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:justify-between">
  <div><div className="font-display text-2xl">EcoTrace</div><p className="text-sm opacity-70">Scan Smart. Waste Less. Live Greener.</p></div>
  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">{links.map(([to, l]) => <Link key={to} to={to} className="opacity-80 hover:opacity-100">{l}</Link>)}</div></div></footer>
