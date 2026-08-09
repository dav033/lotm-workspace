import React, { forwardRef } from 'react'
import type { CardUiProps } from './types'
import { fontSizeCss } from './textStyle'

const FullImageCoverCard = forwardRef<HTMLElement, CardUiProps>(function FullImageCoverCard(
  { image, title, fontSizes, onUploadImage }: CardUiProps,
  ref,
) {
  const upload = (file: File | undefined) => {
    if (file?.type.startsWith('image/')) onUploadImage(file, 'fullCoverImage')
  }

  return (
    <article className="full-image-cover" id="card" ref={ref} aria-label={title || 'Full image cover'}>
      <button
        type="button"
        className={'full-cover-image' + (image ? '' : ' empty')}
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
        aria-label="Upload full cover image"
        onClick={(event) => (event.currentTarget.nextElementSibling as HTMLInputElement | null)?.click()}
        onDragOver={(event) => { event.preventDefault() }}
        onDragLeave={() => undefined}
        onDrop={(event) => {
          event.preventDefault()
          upload([...event.dataTransfer.files].find((file) => file.type.startsWith('image/')))
        }}
      >
        {!image && <span style={fontSizeCss(fontSizes, 'placeholder')}>Drop or click to upload image</span>}
      </button>
      <input
        type="file"
        accept="image/*"
        aria-label="Choose full cover image"
        hidden
        onChange={(event) => upload(event.target.files?.[0])}
      />
      <h2 className="full-cover-title" style={fontSizeCss(fontSizes, 'title')}>{title || 'Cover title'}</h2>
    </article>
  )
})

export default FullImageCoverCard
