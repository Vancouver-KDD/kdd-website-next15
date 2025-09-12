'use client'

import {useCallback, useMemo, useRef, useState} from 'react'
import {Image} from '@heroui/image'
import {Button} from '@heroui/button'
import {Trash2} from 'lucide-react'
import posthog from 'posthog-js'
import {addToast} from '@heroui/toast'
import {getErrorMessage} from '@/lib/utils'

type PosterDropzoneProps = {
  imageUrl?: string
  onImageUrlChange?: (url: string) => void
  onFileSelected: (file: File) => Promise<string>
  onDelete?: () => Promise<void>
  disabled?: boolean
  label?: string
}

export function PosterDropzone({
  imageUrl,
  onImageUrlChange,
  onFileSelected,
  onDelete,
  disabled,
  label = 'Poster',
}: PosterDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [localUploading, setLocalUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const hasImage = useMemo(() => Boolean(imageUrl), [imageUrl])

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled || localUploading) return
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (!file || !file.type.startsWith('image/')) return
      await handleUpload(file)
    },
    [disabled, localUploading]
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

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget
    const file = inputEl.files?.[0]
    if (!file) return
    await handleUpload(file)
    if (inputEl) inputEl.value = ''
  }, [])

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled || localUploading) return
      setLocalUploading(true)
      try {
        const url = await onFileSelected(file)
        onImageUrlChange?.(url)
      } catch (error) {
        posthog.capture('error', {
          error: 'Failed to upload poster',
          message: getErrorMessage(error, 'Failed to upload poster'),
        })
        addToast({
          title: 'Upload failed',
          description: getErrorMessage(error, 'Failed to upload poster'),
          color: 'danger',
        })
      } finally {
        setLocalUploading(false)
      }
    },
    [disabled, onFileSelected, onImageUrlChange]
  )

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-default-200 hover:border-default-400 rounded-medium relative flex cursor-pointer items-center gap-4 border-2 border-dashed p-3 transition-colors ${
          isDragging ? 'bg-default-100' : ''
        } ${disabled ? 'opacity-60' : ''}`}
        onClick={() => !disabled && inputRef.current?.click()}>
        <input
          ref={inputRef}
          id="poster-upload"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={disabled || localUploading}
          className="hidden"
        />

        {/* Preview */}
        <div className="bg-default-50 flex h-20 w-20 items-center justify-center overflow-hidden rounded-md border">
          {hasImage ? (
            <Image src={imageUrl} alt="Poster" className="h-full w-full object-cover" />
          ) : (
            <div className="text-default-400 text-xs">No poster</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">
            {hasImage ? 'Change poster' : 'Drag & drop or click to upload'}
          </div>
          <div className="text-default-500 mt-1 text-xs">
            AVIF/JPG recommended
            <br /> ⚠️ On upload, poster will update right away
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-2">
          {localUploading && <div className="text-default-500 text-xs">Uploading...</div>}
          {hasImage && onDelete && !localUploading && (
            <Button
              isIconOnly
              variant="ghost"
              color="danger"
              startContent={<Trash2 className="h-5 w-5" />}
              onPress={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}
