import React, { forwardRef } from 'react'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

const coverDefaultImage = '/cover-default.jpg'

// A dropzone that fills with an uploaded image; drag & drop or click to upload.
function CoverSlot({ image, field, onUploadImage, placeholder, className = '', children, fontSizes }: CardUiProps) {
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    const file = [...e.dataTransfer.files].find((f) => f.type.startsWith('image/'))
    if (file) onUploadImage(file, field)
  }

  return (
    <div
      className={'cover-slot' + (image ? '' : ' empty') + ' ' + className}
      style={image ? { backgroundImage: `url("${image}")` } : undefined}
      onDragOver={(e) => { e.preventDefault() }}
      onDragLeave={(e) => { e.preventDefault() }}
      onDrop={handleDrop}
      onClick={(e) => e.currentTarget.querySelector<HTMLInputElement>('input')?.click()}
    >
      {!image && <span className="cover-ph" style={fontSizeCss(fontSizes, 'placeholder')}>{placeholder}</span>}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onUploadImage(e.target.files?.[0], field)}
      />
      {children}
    </div>
  )
}

// "Lord of Mysteries" is this app's one constant crossover partner, so only
// the other series' title and the part number are ever user input — every
// other word in the text block is fixed.
const CoverCard = forwardRef<HTMLDivElement, CardUiProps>(function CoverCard({ image1, image2, title, part, fontSizes, onUploadImage }: CardUiProps, ref) {
  return (
    <div className="cover-card" id="card" ref={ref}>
      <CoverSlot
        image={image1}
        field="coverImage1"
        onUploadImage={onUploadImage}
        placeholder="Drop or click to upload top image"
        className="cover-slot-1"
        fontSizes={fontSizes}
      />

      <CoverSlot
        image={image2 || coverDefaultImage}
        field="coverImage2"
        onUploadImage={onUploadImage}
        placeholder="Drop or click to upload main image"
        className="cover-slot-2"
        fontSizes={fontSizes}
      />

      <div className="cover-text">
        <div className="cover-header">
          <span className="cover-hl" style={fontSizeCss(fontSizes, 'title')}>PATHWAYS IN</span> <span className="cover-rest" style={fontSizeCss(fontSizes, 'title')}>{title}</span>
        </div>
        <div className="cover-part" style={fontSizeCss(fontSizes, 'part')}>PART {part}</div>
        <div className="cover-subtitle" style={fontSizeCss(fontSizes, 'subtitle')}>LORD OF MYSTERIES × {(title || '').toUpperCase()}</div>
      </div>
    </div>
  )
})

export default CoverCard
