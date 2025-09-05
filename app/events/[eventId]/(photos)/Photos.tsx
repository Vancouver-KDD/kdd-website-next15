import {RowsPhotoAlbum} from 'react-photo-album'
import 'react-photo-album/rows.css'
import {Image} from '@heroui/image'
import {cn} from '@heroui/theme'
import type {RenderImageProps, RenderImageContext} from 'react-photo-album'
import type {Photo} from 'react-photo-album'

export default function Photos({photos}: {photos: Photo[]}) {
  return (
    <RowsPhotoAlbum
      photos={photos}
      breakpoints={breakpoints}
      render={{
        image: (
          {alt = '', title, sizes, className, style, onClick}: RenderImageProps,
          {photo, width, height}: RenderImageContext
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
              onClick={onClick}
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
  )
}

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48]
