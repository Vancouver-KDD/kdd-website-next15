'use client'
import {useState} from 'react'
import {Button} from '@heroui/button'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Spinner} from '@heroui/spinner'
import {uploadEventPhoto} from '@/cloudinary/actions'
import {useAuthStore} from '@/firebase/AuthClient'

interface AdminPhotoUploadProps {
  eventId: string
}

export default function AdminPhotoUpload({eventId}: AdminPhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const {user} = useAuthStore()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadStatus('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadStatus('Uploading...')

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string
        const idToken = await user?.getIdToken()
        if (!idToken) {
          return
        }
        const result = await uploadEventPhoto({
          token: idToken,
          eventId,
          imageData,
          fileName: selectedFile.name.split('.')[0],
        })

        if (result.success) {
          setUploadStatus('✅ Photo uploaded successfully!')
          setSelectedFile(null)
          // Reset file input
          const fileInput = document.getElementById('photo-upload') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        } else {
          setUploadStatus(`❌ Error: ${result.error}`)
        }
      }
      reader.readAsDataURL(selectedFile)
    } catch (error) {
      setUploadStatus('❌ Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mx-auto mt-8 max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">Upload Photo to Event</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        <div>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file:bg-primary hover:file:bg-primary-600 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </div>

        {selectedFile && (
          <div className="text-default-600 text-sm">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        <Button
          onPress={handleUpload}
          disabled={!selectedFile || isUploading}
          color="primary"
          className="w-full">
          {isUploading ? (
            <>
              <Spinner size="sm" />
              Uploading...
            </>
          ) : (
            'Upload Photo'
          )}
        </Button>

        {uploadStatus && <div className="text-center text-sm">{uploadStatus}</div>}
      </CardBody>
    </Card>
  )
}
