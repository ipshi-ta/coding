import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
export const Loading = ({ text = 'Loading…' }) => <div className="flex items-center gap-2 p-8 text-emerald"><Loader2 className="animate-spin" />{text}</div>
export const ErrorBox = ({ message, demo }) => <div className="flex gap-3 rounded-xl border border-amber-300 bg-sun/50 p-4 text-sm"><AlertTriangle className="shrink-0" size={18} /><div>{message}{demo && <b className="block">Showing temporary demo data stored in this browser only.</b>}</div></div>
export const Empty = ({ title, text, to, cta }) => <div className="card text-center"><Inbox className="mx-auto mb-3 text-sage" size={40} /><h3 className="text-xl">{title}</h3><p className="mx-auto mt-1 max-w-md text-sm opacity-80">{text}</p>{to && <Link to={to} className="btn mt-4">{cta}</Link>}</div>
export const Page = ({ title, sub, children }) => <main className="mx-auto max-w-6xl px-4 py-10"><h1 className="text-4xl">{title}</h1>{sub && <p className="mb-8 mt-1 opacity-75">{sub}</p>}<div className="space-y-6">{children}</div></main>
