'use client'
import {useState} from 'react'
import {RowsPhotoAlbum} from 'react-photo-album'
import 'react-photo-album/rows.css'
import {Image} from '@heroui/image'
import {cn} from '@heroui/theme'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import 'yet-another-react-lightbox/plugins/captions.css'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import type {RenderImageProps, RenderImageContext} from 'react-photo-album'
import type {Photo} from 'react-photo-album'

export default function Photos({photos}: {photos: Photo[]}) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <>
      <RowsPhotoAlbum
        spacing={5}
        photos={photos}
        breakpoints={breakpoints}
        render={{
          image: (
            {alt = '', title, sizes, className, style, onClick}: RenderImageProps,
            {photo, width, height, index}: RenderImageContext
          ) => (
            <div
              className={cn('relative w-full', className)}
              style={{
                ...style,
                aspectRatio: `${width} / ${height}`,
              }}>
              <Image
                className="h-full w-full object-cover"
                classNames={{
                  wrapper: 'block w-full h-full',
                }}
                onClick={(e) => {
                  onClick?.(e)
                  setOpen(true)
                  setCurrentIndex(index)
                }}
                radius="none"
                isZoomed
                width="100%"
                src={photo.src}
                sizes={sizes}
                alt={alt}
                title={title}
                // srcSet={photo.srcSet}
              />
            </div>
          ),
        }}
        onClick={() => {}}
      />
      <Lightbox
        plugins={[Captions, Counter, Fullscreen, Zoom]}
        captions={{
          hidden: true,
          showToggle: true,
          descriptionTextAlign: 'center',
        }}
        zoom={{
          maxZoomPixelRatio: 4,
          doubleClickDelay: 300,
        }}
        index={currentIndex}
        open={open}
        close={() => setOpen(false)}
        slides={photos}
      />
    </>
  )
}

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48]
