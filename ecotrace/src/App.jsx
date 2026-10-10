import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; import { useEffect } from 'react'
import Navbar from './components/Navbar'; import Footer from './components/Footer'
import Home from './pages/Home'; import Scan from './pages/Scan'; import Result from './pages/Result'; import History from './pages/History'
import Dashboard from './pages/Dashboard'; import Alternatives from './pages/Alternatives'; import Composting from './pages/Composting'
import Recyclers from './pages/Recyclers'; import Carbon from './pages/Carbon'; import Education from './pages/Education'
export default function App() {
  const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return <><Navbar /><Routes>
    <Route path="/" element={<Home />} /><Route path="/scan" element={<Scan />} /><Route path="/result" element={<Result />} />
    <Route path="/history" element={<History />} /><Route path="/dashboard" element={<Dashboard />} /><Route path="/alternatives" element={<Alternatives />} />
    <Route path="/composting" element={<Composting />} /><Route path="/recyclers" element={<Recyclers />} /><Route path="/carbon" element={<Carbon />} />
    <Route path="/education" element={<Education />} /><Route path="*" element={<Navigate to="/" />} /></Routes><Footer /></>
}
