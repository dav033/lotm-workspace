/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useRef, useState } from 'react'
import DurationBadge from './DurationBadge'

// Bandeja de imagenes importadas. A diferencia del filmstrip de cartas, aqui
// no se edita nada: solo se importa, se ordena, se borra y se exporta a MP4.
export default function ImageTray({
  images, busy, seconds, onImport, onDelete, onReorder, onExportVideo, onImageDuration,
}) {
  const inputRef = useRef(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)
  const [dropping, setDropping] = useState(false)

  const pick = (fileList) => {
    const files = [...fileList].filter((file) => file.type.startsWith('image/'))
    if (files.length) void onImport(files)
  }

  const handleDrop = (to) => {
    if (dragIndex !== null && dragIndex !== to) {
      const next = [...images]
      next.splice(to, 0, ...next.splice(dragIndex, 1))
      void onReorder(next.map((image) => image.id))
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  const indexAtPoint = (clientX, clientY) => {
    const target = document.elementFromPoint(clientX, clientY)?.closest('[data-image-index]')
    const index = Number(target?.getAttribute('data-image-index'))
    return Number.isInteger(index) ? index : null
  }

  const startPointerDrag = (event, index) => {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragIndex(index)
    setOverIndex(index)
  }

  const movePointerDrag = (event) => {
    if (dragIndex === null) return
    const index = indexAtPoint(event.clientX, event.clientY)
    if (index !== null) setOverIndex(index)
  }

  const endPointerDrag = (event) => {
    event.stopPropagation()
    if (dragIndex !== null && overIndex !== null) handleDrop(overIndex)
  }

  const cancelPointerDrag = (event) => {
    event.stopPropagation()
    setDragIndex(null)
    setOverIndex(null)
  }

  const moveByOne = (from, to) => {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    next.splice(to, 0, ...next.splice(from, 1))
    void onReorder(next.map((image) => image.id))
  }

  return (
    <div className="image-tray">
      <div className="image-tray-head">
        <span className="image-tray-title">Imagenes ({images.length})</span>
        <button
          className="image-tray-add"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >Importar</button>
        <button
          className="image-tray-video"
          disabled={busy || !images.length}
          title={
            `Exportar ${images.length} imagenes en MP4 · ` +
            'baja 2 archivos: original (3:4) y vertical para Shorts (9:16)'
          }
          onClick={() => onExportVideo()}
        >Vídeo MP4</button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => { pick(e.target.files); e.target.value = '' }}
        />
      </div>

      <div
        className={'image-tray-rail' + (dropping ? ' dropping' : '')}
        onDragOver={(e) => {
          // Solo se resalta cuando lo que se arrastra son archivos; reordenar
          // dentro de la bandeja no debe parecer una importacion.
          if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDropping(true) }
        }}
        onDragLeave={() => setDropping(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return
          e.preventDefault()
          setDropping(false)
          pick(e.dataTransfer.files)
        }}
      >
        {images.length === 0 ? (
          <p className="image-tray-empty">Arrastra imagenes aqui o pulsa Importar.</p>
        ) : images.map((image, index) => (
          <div
            key={image.id}
            data-image-index={index}
            className={'image-thumb' + (overIndex === index && dragIndex !== null ? ' over' : '')}
            title={image.name}
          >
            <span className="image-no">{index + 1}</span>
            <img src={image.url} alt={image.name} />
            {index > 0 ? (
              <button
                className="image-move left"
                type="button"
                aria-label={`Mover ${image.name} a la izquierda`}
                onClick={() => moveByOne(index, index - 1)}
              >‹</button>
            ) : null}
            {index < images.length - 1 ? (
              <button
                className="image-move right"
                type="button"
                aria-label={`Mover ${image.name} a la derecha`}
                onClick={() => moveByOne(index, index + 1)}
              >›</button>
            ) : null}
            <button
              className="image-drag-handle"
              type="button"
              aria-label={`Reordenar ${image.name}`}
              title="Arrastrar para reordenar"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => startPointerDrag(event, index)}
              onPointerMove={movePointerDrag}
              onPointerUp={endPointerDrag}
              onPointerCancel={cancelPointerDrag}
            >⋮⋮</button>
            <button
              className="image-rm"
              aria-label={`Quitar ${image.name}`}
              onClick={() => onDelete(image.id)}
            >×</button>
            <DurationBadge
              value={image.durationSeconds}
              fallback={seconds}
              disabled={busy}
              onChange={(value) => onImageDuration(image.id, value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
// @ts-nocheck
