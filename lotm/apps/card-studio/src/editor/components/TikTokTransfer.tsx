'use client'

import { useEffect, useMemo, useState } from 'react'
import { fromBuilderCardState, type BuilderCardState } from '../../domain/schema'

type CarouselCard = {
  id: string
  position: number
  state: BuilderCardState
  part: { id: string; name: string; number: number | null }
}
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

export default function TikTokTransfer({ cards, currentCardId }: { cards: CarouselCard[]; currentCardId: string | null }) {
  const [connection, setConnection] = useState<Connection | null>(null)
  const [mode, setMode] = useState<'video' | 'carousel'>('video')
  const [video, setVideo] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrls, setPhotoUrls] = useState('')
  const [carouselSelected, setCarouselSelected] = useState(false)
  const [renderedCardIds, setRenderedCardIds] = useState<string[]>([])
  const [selectedPartId, setSelectedPartId] = useState('')
  const [coverIndex, setCoverIndex] = useState('0')
  const [publishId, setPublishId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const sections = useMemo(() => {
    const grouped = new Map<string, { id: string; name: string; number: number | null; count: number }>()
    for (const card of cards) {
      const current = grouped.get(card.part.id)
      if (current) current.count += 1
      else grouped.set(card.part.id, { ...card.part, count: 1 })
    }
    return [...grouped.values()]
  }, [cards])

  const currentPartId = cards.find((card) => card.id === currentCardId)?.part.id ?? sections[0]?.id ?? ''
  const selectedCards = useMemo(
    () => cards
      .filter((card) => card.part.id === selectedPartId)
      .slice()
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id)),
    [cards, selectedPartId],
  )
  const carouselOrderMatches = carouselSelected
    && renderedCardIds.length === selectedCards.length
    && renderedCardIds.every((id, index) => id === selectedCards[index]?.id)

  useEffect(() => {
    if (!selectedPartId && currentPartId) setSelectedPartId(currentPartId)
  }, [currentPartId, selectedPartId])

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

  async function pngToJpeg(png: Blob): Promise<Blob> {
    const bitmap = await createImageBitmap(png)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Could not prepare the carousel image.')
    context.fillStyle = '#0a0a11'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0)
    bitmap.close()
    return new Promise((resolve, reject) => {
      canvas.toBlob((jpeg) => {
        if (jpeg) resolve(jpeg)
        else reject(new Error('Could not encode the carousel image.'))
      }, 'image/jpeg', 0.92)
    })
  }

  async function renderCurrentCarousel() {
    if (!selectedCards.length) return setError('Create at least one card in the current section first.')
    if (selectedCards.length > 35) return setError('TikTok accepts up to 35 images per carousel.')

    setBusy(true)
    setError('')
    setStatus('Rendering the current carousel…')
    try {
      const urls: string[] = []
      for (const card of selectedCards) {
        const rendered = await fetch('/api/cards/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card: fromBuilderCardState(card.state) }),
        })
        if (!rendered.ok) throw new Error(`Could not render card ${card.id}.`)

        const form = new FormData()
        form.append('file', await pngToJpeg(await rendered.blob()), `${card.id}.jpg`)
        const stored = await fetch('/api/cards/images', { method: 'POST', body: form })
        const data = await stored.json()
        if (!stored.ok || typeof data.url !== 'string') throw new Error(data.error ?? 'Could not store a rendered card.')
        urls.push(new URL(data.url, window.location.origin).toString())
      }

      setPhotoUrls(urls.join('\n'))
      setRenderedCardIds(selectedCards.map(({ id }) => id))
      setCarouselSelected(true)
      setStatus(`Carousel ready: ${urls.length} app-generated image${urls.length === 1 ? '' : 's'}.`)
    } catch (caught) {
      setStatus('')
      setError(caught instanceof Error ? caught.message : 'Could not prepare the carousel.')
    } finally {
      setBusy(false)
    }
  }

  function changeSection(partId: string) {
    setSelectedPartId(partId)
    setPhotoUrls('')
    setCarouselSelected(false)
    setRenderedCardIds([])
    setCoverIndex('0')
    setError('')
  }

  function clearCarouselSelection() {
    setPhotoUrls('')
    setCarouselSelected(false)
    setRenderedCardIds([])
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
    if (!carouselOrderMatches) return setError('Card order changed. Re-render the carousel before sending.')
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
              <div className="tiktok-carousel-picker">
                <div className="tiktok-carousel-picker-head">
                  <span>Card Studio carousel</span>
                  <strong>{selectedCards.length} card{selectedCards.length === 1 ? '' : 's'}</strong>
                </div>
                <label>
                  <span>Section</span>
                  <select value={selectedPartId} disabled={busy || !sections.length} onChange={(event) => changeSection(event.target.value)}>
                    {!sections.length ? <option value="">No cards available</option> : null}
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>{section.name} · {section.count} cards</option>
                    ))}
                  </select>
                </label>
                {photoUrls.trim() ? (
                  <div className="tiktok-carousel-preview" aria-label="Current carousel preview">
                    {photoUrls.split(/\r?\n/).filter(Boolean).map((url, index) => (
                      <div className="tiktok-carousel-thumb" key={url} title={`Generated card ${index + 1}`}>
                        <img src={url} alt={`Generated card ${index + 1}`} />
                        <span>{index + 1}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="tiktok-muted">The selected cards will be rendered by Card Studio.</p>}
                {carouselSelected && !carouselOrderMatches ? <p className="tiktok-muted">Card order changed. Re-render carousel to preserve the exact order.</p> : null}
                <button
                  type="button"
                  className="tiktok-secondary"
                  disabled={busy || !selectedCards.length || selectedCards.length > 35}
                  onClick={() => void renderCurrentCarousel()}
                >
                  {carouselSelected ? 'Re-render current carousel' : 'Use current carousel'}
                </button>
                {carouselSelected ? <button type="button" className="tiktok-link" onClick={clearCarouselSelection}>Clear rendered carousel</button> : null}
              </div>
              <label><span>Cover image number (0 = first)</span><input type="number" min="0" max={Math.max(0, selectedCards.length - 1)} value={coverIndex} onChange={(event) => setCoverIndex(event.target.value)} /></label>
              <p className="tiktok-muted">Card Studio renders the selected cards and sends those generated images. TikTok receives them as a draft for final editing and publishing.</p>
              <button type="button" className="tiktok-primary" disabled={busy || !carouselOrderMatches || !photoUrls.trim()} onClick={() => void sendCarousel()}>
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
