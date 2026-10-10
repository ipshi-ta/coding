import { useRef, useState, useEffect } from 'react'; import { useNavigate } from 'react-router-dom'
import { Camera, Upload, RotateCcw, Send, Video } from 'lucide-react'
import { api } from '../lib/api'; import { Page, ErrorBox, Loading } from '../components/ui'
export default function Scan() {
  const [tab, setTab] = useState('single'); const nav = useNavigate()
  const video = useRef(); const stream = useRef()
  const [file, setFile] = useState(null); const [preview, setPreview] = useState(null)
  const [camOn, setCamOn] = useState(false); const [err, setErr] = useState(null); const [busy, setBusy] = useState(false)
  const stop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; setCamOn(false) }
  useEffect(() => stop, [])
  useEffect(() => { if (camOn && video.current) video.current.srcObject = stream.current }, [camOn])
  const open = async () => {
    setErr(null)
    if (!navigator.mediaDevices?.getUserMedia) return setErr('Your browser does not support camera access. Try uploading an image instead.')
    try { stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }); setCamOn(true) }
    catch (e) { setErr(e.name === 'NotAllowedError' ? 'Camera permission was denied. Allow camera access in your browser settings, or upload an image.' : e.name === 'NotFoundError' ? 'No camera was found on this device. Upload an image instead.' : 'Could not start the camera: ' + e.message) }
  }
  const setImg = f => { setFile(f); setPreview(URL.createObjectURL(f)) }
  const capture = () => {
    const v = video.current, c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d').drawImage(v, 0, 0); c.toBlob(b => { setImg(new File([b], 'capture.jpg', { type: 'image/jpeg' })); stop() }, 'image/jpeg', 0.9)
  }
  const retake = () => { setFile(null); setPreview(null); setErr(null) }
  const submit = async () => {
    setBusy(true); setErr(null)
    try { const r = await api.scan(file); nav('/result', { state: { result: r, preview } }) }
    catch (e) { setErr(e.message) } finally { setBusy(false) }
  }
  return <Page title="Scan Waste" sub="Photograph a single item for analysis by the EcoTrace backend.">
    <div className="flex gap-2">{[['single', 'Scan One Item'], ['multi', 'Scan Multiple Items']].map(([k, l]) =>
      <button key={k} onClick={() => setTab(k)} className={tab === k ? 'btn' : 'btn-alt'}>{l}{k === 'multi' && <span className="rounded bg-sun px-1.5 text-xs text-forest">Coming Soon</span>}</button>)}</div>
    {tab === 'multi' ? <div className="card"><h3 className="text-xl">Multi-object scanning: Coming Soon</h3>
      <p className="mt-2 text-sm opacity-80">Detecting several items with bounding boxes, per-item categories and confirm/correct controls needs backend support that is not available yet. We will not simulate results. This tab will populate once the backend reports multi-object detection.</p></div> :
    <div className="card space-y-4">
      {err && <ErrorBox message={err} />}
      {!preview && !camOn && <div className="flex flex-wrap gap-3"><button className="btn" onClick={open}><Video size={18} />Open Camera</button>
        <label className="btn-alt cursor-pointer"><Upload size={18} />Upload Image<input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && setImg(e.target.files[0])} /></label></div>}
      {camOn && <div><video ref={video} autoPlay playsInline muted className="w-full max-w-lg rounded-xl bg-black" />
        <div className="mt-3 flex gap-3"><button className="btn" onClick={capture}><Camera size={18} />Capture</button><button className="btn-alt" onClick={stop}>Close</button></div></div>}
      {preview && <div><img src={preview} alt="Preview" className="max-h-96 rounded-xl" />
        <div className="mt-3 flex gap-3"><button className="btn-alt" onClick={retake} disabled={busy}><RotateCcw size={18} />Retake</button>
          <button className="btn" onClick={submit} disabled={busy}><Send size={18} />Analyse</button></div></div>}
      {busy && <Loading text="Analysing image…" />}
    </div>}
  </Page>
}
