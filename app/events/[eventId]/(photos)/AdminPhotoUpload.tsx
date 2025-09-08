'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Spinner} from '@heroui/spinner'
import {uploadEventPhoto} from '@/cloudinary/actions'
import {useAuthStore} from '@/firebase/AuthClient'
import type {Photo} from 'react-photo-album'

interface AdminPhotoUploadProps {
  eventId: string
  onUploaded?: (photo: Photo) => void
}

type UploadStatus = 'queued' | 'reading' | 'uploading' | 'success' | 'error'

type UploadItem = {
  id: string
  file: File
  name: string
  sizeBytes: number
  status: UploadStatus
  errorMessage?: string
}

export default function AdminPhotoUpload({eventId, onUploaded}: AdminPhotoUploadProps) {
  const {user} = useAuthStore()

  const [items, setItems] = useState<UploadItem[]>([])
  const itemsRef = useRef<UploadItem[]>(items)
  const updateItems = useCallback((updater: (prev: UploadItem[]) => UploadItem[]) => {
    setItems((prev) => {
      const next = updater(prev)
      itemsRef.current = next
      return next
    })
  }, [])

  const [isDragging, setIsDragging] = useState(false)
  const processingRef = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const hasActive = useMemo(
    () => items.some((i) => i.status === 'reading' || i.status === 'uploading'),
    [items]
  )

  const addFilesToQueue = useCallback(
    (files: FileList | File[]) => {
      const asArray = Array.from(files)
        .filter((f) => f.type.startsWith('image/'))
        .map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
          file,
          name: file.name,
          sizeBytes: file.size,
          status: 'queued' as UploadStatus,
        }))
      if (asArray.length === 0) return
      updateItems((prev) => [...prev, ...asArray])
    },
    [updateItems]
  )

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files && files.length > 0) {
        addFilesToQueue(files)
        event.currentTarget.value = ''
      }
    },
    [addFilesToQueue]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFilesToQueue(e.dataTransfer.files)
        e.dataTransfer.clearData()
      }
    },
    [addFilesToQueue]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const clearCompleted = useCallback(() => {
    updateItems((prev) => prev.filter((i) => i.status !== 'success'))
  }, [updateItems])

  const cancelErrored = useCallback(() => {
    updateItems((prev) => prev.filter((i) => i.status !== 'error'))
  }, [updateItems])

  const processNext = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = itemsRef.current.find((i) => i.status === 'queued')
        if (!next) break

        updateItems((prev) =>
          prev.map((it) => (it.id === next.id ? {...it, status: 'reading'} : it))
        )

        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.onabort = () => reject(new Error('Reading aborted'))
          reader.onload = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(next.file)
        })

        updateItems((prev) =>
          prev.map((it) => (it.id === next.id ? {...it, status: 'uploading'} : it))
        )

        try {
          const idToken = await user?.getIdToken()
          if (!idToken) {
            throw new Error('Not authenticated')
          }
          const baseName = next.name.includes('.')
            ? next.name.substring(0, next.name.lastIndexOf('.'))
            : next.name
          const result = await uploadEventPhoto({
            token: idToken,
            eventId,
            imageData: dataUrl,
            fileName: baseName,
          })

          if (result.success) {
            updateItems((prev) =>
              prev.map((it) => (it.id === next.id ? {...it, status: 'success'} : it))
            )
            if (result.photo && onUploaded) {
              onUploaded(result.photo as Photo)
            }
          } else {
            updateItems((prev) =>
              prev.map((it) =>
                it.id === next.id
                  ? {
                      ...it,
                      status: 'error',
                      errorMessage: result.error || 'Upload failed',
                    }
                  : it
              )
            )
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Upload failed'
          updateItems((prev) =>
            prev.map((it) =>
              it.id === next.id ? {...it, status: 'error', errorMessage: message} : it
            )
          )
        }
      }
    } finally {
      processingRef.current = false
    }
  }, [eventId, onUploaded, updateItems, user])

  useEffect(() => {
    if (!processingRef.current && itemsRef.current.some((i) => i.status === 'queued')) {
      void processNext()
    }
  }, [items, processNext])

  const queuedCount = useMemo(() => items.filter((i) => i.status === 'queued').length, [items])
  const successCount = useMemo(() => items.filter((i) => i.status === 'success').length, [items])
  const errorCount = useMemo(() => items.filter((i) => i.status === 'error').length, [items])

  return (
    <Card className="mx-auto mt-8 w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between">
        <div className="text-default-500 text-sm">
          {successCount > 0 && <span className="mr-3">{successCount} uploaded</span>}
          {queuedCount > 0 && <span className="mr-3">{queuedCount} queued</span>}
          {errorCount > 0 && <span>{errorCount} failed</span>}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-default-200 hover:border-default-400 rounded-medium flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'bg-default-100' : ''
          }`}
          onClick={() => inputRef.current?.click()}>
          <input
            ref={inputRef}
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="mb-2 text-base font-medium">Drag and drop images here</div>
          <div className="text-default-500 text-sm">or click to select files</div>
        </div>

        {items.length > 0 && (
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-default-100 rounded-medium flex items-center justify-between border p-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.name}</div>
                  <div className="text-default-500 mt-1 text-xs">
                    {(item.sizeBytes / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div className="ml-4 flex w-28 items-center justify-end">
                  {item.status === 'queued' && (
                    <span className="text-default-500 text-xs">Queued</span>
                  )}
                  {item.status === 'reading' && (
                    <span className="text-default-500 text-xs">Preparing</span>
                  )}
                  {item.status === 'uploading' && (
                    <span className="text-default-500 text-xs">Uploading</span>
                  )}
                  {item.status === 'success' && <span className="text-success text-xs">Done</span>}
                  {item.status === 'error' && (
                    <span className="text-danger text-xs">{item.errorMessage || 'Error'}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="flat" onPress={clearCompleted} isDisabled={successCount === 0}>
            Clear completed
          </Button>
          <Button size="sm" variant="flat" onPress={cancelErrored} isDisabled={errorCount === 0}>
            Remove failed
          </Button>
        </div>

        {hasActive && (
          <div className="text-default-500 flex items-center justify-center gap-2 text-sm">
            <Spinner size="sm" /> Uploading...
          </div>
        )}
      </CardBody>
    </Card>
  )
}
