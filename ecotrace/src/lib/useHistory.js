import { useEffect, useState, useCallback } from 'react'
import { api, demoStore } from './api'
export default function useHistory() {
  const [s, set] = useState({ loading: true, items: [], demo: false, error: null })
  const load = useCallback(async () => {
    set(x => ({ ...x, loading: true }))
    try { const d = await api.history(); set({ loading: false, items: d.items || d, demo: false, error: null }) }
    catch (e) { set({ loading: false, items: demoStore.all(), demo: true, error: e.message }) }
  }, [])
  useEffect(() => { load() }, [load])
  return { ...s, reload: load }
}
