'use client'

import {startTransition, useMemo, useOptimistic, useState} from 'react'
import {RowsPhotoAlbum} from 'react-photo-album'
import 'react-photo-album/rows.css'
import {Image} from '@heroui/image'
import {cn, colors} from '@heroui/theme'
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
import dynamic from 'next/dynamic'
import {useAuthStore} from '@/firebase/AuthClient'
import {deleteEventPhoto, moveEventPhoto} from '@/firebase/actions/event'
import {arrayMove} from '@dnd-kit/sortable'
import {addToast} from '@heroui/toast'
import AdminPhotoUpload from '@/app/events/[eventId]/(photos)/AdminPhotoUpload'
import {Button} from '@heroui/button'
import {Trash2} from 'lucide-react'

type PhotosAction =
  | {type: 'prepend'; photo: Photo}
  | {type: 'move'; oldIndex: number; newIndex: number}
  | {type: 'removeAt'; index: number}
  | {type: 'reset'; photos: Photo[]}

export default function Photos({photos, eventId}: {photos: Photo[]; eventId: string}) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const admin = useAuthStore((s) => s.admin)
  const {user} = useAuthStore()
  const [photosOptimistic, updatePhotosOptimistic] = useOptimistic<Photo[], PhotosAction>(
    photos,
    (state, action) => {
      switch (action.type) {
        case 'prepend':
          return [action.photo, ...state]
        case 'move':
          return arrayMove(state, action.oldIndex, action.newIndex)
        case 'removeAt':
          return state.filter((_, i) => i !== action.index)
        case 'reset':
          return action.photos
        default:
          return state
      }
    }
  )

  const Gallery = useMemo(
    () => (admin ? dynamic(() => import('./SortableGallery'), {ssr: false}) : RowsPhotoAlbum),
    [admin]
  )

  return (
    <div className="flex flex-col gap-16">
      {!!admin && (
        <AdminPhotoUpload
          eventId={eventId}
          onUploaded={(photo) => {
            startTransition(() => {
              updatePhotosOptimistic({type: 'prepend', photo})
            })
          }}
        />
      )}
      <Gallery
        gallery={RowsPhotoAlbum}
        movePhoto={async (oldIndex, newIndex) => {
          startTransition(() => {
            updatePhotosOptimistic({type: 'move', oldIndex, newIndex})
          })
          const idToken = await user?.getIdToken()
          if (idToken) {
            const {success, message} = await moveEventPhoto(idToken, eventId, oldIndex, newIndex)
            if (success) {
            } else {
              startTransition(() => {
                updatePhotosOptimistic({type: 'reset', photos})
              })
              addToast({
                title: 'Move Photo Failed',
                description: message,
                color: 'danger',
              })
            }
          }
        }}
        spacing={5}
        photos={photosOptimistic}
        breakpoints={breakpoints}
        render={{
          image: (
            {alt = '', title, sizes, className, style, onClick}: RenderImageProps,
            {photo, width, height, index}: RenderImageContext
          ) => (
            <div
              className={cn('relative max-h-96 w-full', className)}
              style={{
                ...style,
                aspectRatio: `${width} / ${height}`,
              }}>
              <Image
                className={cn(
                  'h-full max-h-96 w-full object-cover',
                  'transition-shadow ease-in-out hover:shadow-xl hover:shadow-black/30'
                )}
                classNames={{
                  wrapper: 'block w-full h-full',
                }}
                onClick={(e) => {
                  onClick?.(e)
                  setOpen(true)
                  setCurrentIndex(index)
                }}
                radius="none"
                width="100%"
                src={photo.src}
                sizes={sizes}
                alt={alt}
                title={title}
              />
            </div>
          ),
          extras: (_: object, {index}: RenderImageContext) =>
            admin && (
              <Button
                as="div"
                isIconOnly
                variant="flat"
                className="absolute top-1 right-1 z-10"
                onPress={async () => {
                  const idToken = await user?.getIdToken()
                  if (!idToken) {
                    return
                  }
                  // Remove photo from optimistic photos
                  startTransition(() => {
                    updatePhotosOptimistic({type: 'removeAt', index})
                  })
                  const {success, message} = await deleteEventPhoto(
                    idToken,
                    eventId,
                    photosOptimistic[index]
                  )
                  if (success) {
                    addToast({
                      title: 'Delete Photo Success',
                      description: message,
                      color: 'success',
                    })
                  } else {
                    // Add photo back to optimistic photos
                    startTransition(() => {
                      updatePhotosOptimistic({type: 'reset', photos: photosOptimistic})
                    })
                    addToast({
                      title: 'Delete Photo Failed',
                      description: message,
                      color: 'danger',
                    })
                  }
                }}>
                <Trash2 color={colors.red[500]} />
              </Button>
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
        slides={photosOptimistic}
      />
    </div>
  )
}

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48]
