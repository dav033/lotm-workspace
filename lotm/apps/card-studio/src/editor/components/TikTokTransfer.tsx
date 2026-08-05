'use client'

import { useEffect, useMemo, useState } from 'react'

type ImportedImage = { id: string; name: string; url: string }
type Connection = {
  configured: boolean
  connected: boolean
  openId: string | null
  displayName: string | null
  scopes: string[]
  accessTokenExpiresAt: number | null
}

const EMPTY_CONNECTION: Connection = {
  configured: true,
  connected: false,
  openId: null,
  displayName: null,
  scopes: [],
  accessTokenExpiresAt: null,
}

export default function TikTokTransfer({ images }: { images: ImportedImage[] }) {
  const [connection, setConnection] = useState<Connection | null>(null)
  const [mode, setMode] = useState<'video' | 'carousel'>('video')
  const [video, setVideo] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrls, setPhotoUrls] = useState('')
  const [coverIndex, setCoverIndex] = useState('0')
  const [publishId, setPublishId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const importedUrls = useMemo(
    () => images.map((image) => new URL(image.url, window.location.origin).toString()),
    [images],
  )

  async function refreshConnection() {
    const response = await fetch('/api/tiktok/connection', { cache: 'no-store' })
    const data = await response.json()
    setConnection(response.ok ? data : null)
  }

  useEffect(() => {
    void refreshConnection()
    const params = new URLSearchParams(window.location.search)
    if (params.get('tiktok_connected')) setStatus('TikTok connected. Choose content to send.')
    if (params.get('tiktok_error')) setError(params.get('tiktok_error') ?? 'TikTok connection failed.')
  }, [])

  function useImportedImages() {
    setPhotoUrls(importedUrls.join('\n'))
    setCoverIndex('0')
    setError('')
  }

  async function disconnect() {
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/tiktok/disconnect', { method: 'POST' })
      if (!response.ok) throw new Error((await response.json()).error ?? 'Could not disconnect TikTok.')
      setConnection(EMPTY_CONNECTION)
      setPublishId(null)
      setStatus('TikTok disconnected.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not disconnect TikTok.')
    } finally {
      setBusy(false)
    }
  }

  async function sendVideo() {
    if (!video) return setError('Choose a video first.')
    const form = new FormData()
    form.append('video', video)
    await send('/api/tiktok/upload-video', { method: 'POST', body: form })
  }

  async function sendCarousel() {
    const urls = photoUrls.split(/\r?\n/).map((url) => url.trim()).filter(Boolean)
    await send('/api/tiktok/upload-carousel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, photoUrls: urls, coverIndex: Number(coverIndex) || 0 }),
    })
  }

  async function send(url: string, init: RequestInit) {
    setBusy(true)
    setError('')
    setStatus('Sending to TikTok…')
    setPublishId(null)
    try {
      const response = await fetch(url, init)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'TikTok upload failed.')
      setPublishId(data.publishId)
      setStatus(data.message ?? 'Sent to TikTok.')
    } catch (caught) {
      setStatus('')
      setError(caught instanceof Error ? caught.message : 'TikTok upload failed.')
    } finally {
      setBusy(false)
    }
  }

  async function checkStatus() {
    if (!publishId) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/tiktok/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Could not read TikTok status.')
      setStatus(`TikTok status: ${data.data?.status ?? data.status ?? 'processing'}.`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not read TikTok status.')
    } finally {
      setBusy(false)
    }
  }

  const connected = connection?.connected === true
  const accountLabel = connection?.displayName || connection?.openId || 'TikTok account'

  return (
    <section className="tiktok-transfer" aria-labelledby="tiktok-transfer-title">
      <div className="tiktok-transfer-head">
        <div>
          <p className="tiktok-kicker">Upload API</p>
          <h2 id="tiktok-transfer-title">Send to TikTok</h2>
        </div>
        {connected ? <span className="tiktok-connected-dot" aria-label="TikTok connected" /> : null}
      </div>

      {!connection ? <p className="tiktok-muted">Checking TikTok connection…</p> : null}
      {connection && !connection.configured ? (
        <p className="tiktok-muted">Add TikTok server credentials to enable transfers.</p>
      ) : null}
      {connection?.configured && !connected ? (
        <a className="tiktok-connect" href="/auth/tiktok">Connect TikTok account</a>
      ) : null}

      {connected ? (
        <>
          <div className="tiktok-account">
            <span>Connected account</span>
            <strong>{accountLabel}</strong>
            <button type="button" className="tiktok-link" onClick={disconnect} disabled={busy}>Disconnect</button>
          </div>

          <div className="tiktok-mode" role="tablist" aria-label="TikTok transfer type">
            <button type="button" className={mode === 'video' ? 'active' : ''} onClick={() => setMode('video')}>Video</button>
            <button type="button" className={mode === 'carousel' ? 'active' : ''} onClick={() => setMode('carousel')}>Photo carousel</button>
          </div>

          {mode === 'video' ? (
            <div className="tiktok-fields">
              <label className="tiktok-file">
                <span>Video file</span>
                <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={(event) => setVideo(event.target.files?.[0] ?? null)} />
                <strong>{video?.name ?? 'Choose MP4, MOV or WebM'}</strong>
              </label>
              <p className="tiktok-muted">The video arrives in TikTok Inbox for final editing, publishing or saving as draft.</p>
              <button type="button" className="tiktok-primary" disabled={busy || !video} onClick={() => void sendVideo()}>
                {busy ? 'Sending…' : 'Send video'}
              </button>
            </div>
          ) : (
            <div className="tiktok-fields">
              <label><span>Title</span><input value={title} maxLength={90} onChange={(event) => setTitle(event.target.value)} /></label>
              <label><span>Description</span><textarea value={description} maxLength={4000} onChange={(event) => setDescription(event.target.value)} /></label>
              <label><span>Public image URLs, one per line</span><textarea value={photoUrls} onChange={(event) => setPhotoUrls(event.target.value)} placeholder="https://media.example.com/01.webp" /></label>
              {images.length ? <button type="button" className="tiktok-secondary" onClick={useImportedImages}>Use {images.length} imported image{images.length === 1 ? '' : 's'}</button> : null}
              <label><span>Cover image number</span><input type="number" min="0" max="34" value={coverIndex} onChange={(event) => setCoverIndex(event.target.value)} /></label>
              <p className="tiktok-muted">TikTok must fetch these images over public HTTPS URLs from a verified domain.</p>
              <button type="button" className="tiktok-primary" disabled={busy || !photoUrls.trim()} onClick={() => void sendCarousel()}>
                {busy ? 'Sending…' : 'Send carousel'}
              </button>
            </div>
          )}

          {publishId ? <button type="button" className="tiktok-secondary" disabled={busy} onClick={() => void checkStatus()}>Check transfer status</button> : null}
        </>
      ) : null}

      {status ? <p className="tiktok-status" role="status">{status}</p> : null}
      {error ? <p className="tiktok-error" role="alert">{error}</p> : null}
    </section>
  )
}
