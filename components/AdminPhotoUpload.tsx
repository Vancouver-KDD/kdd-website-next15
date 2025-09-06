'use client'
import {useState} from 'react'
import {Button} from '@heroui/button'
import {Input} from '@heroui/input'
import {Card, CardBody, CardHeader} from '@heroui/card'
import {Spinner} from '@heroui/spinner'
import {uploadEventPhoto} from '@/cloudinary/actions'

interface AdminPhotoUploadProps {
  eventId: string
}

export default function AdminPhotoUpload({eventId}: AdminPhotoUploadProps) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleAuth = () => {
    if (password) {
      setIsAuthenticated(true)
      setUploadStatus('')
    }
  }

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

        const result = await uploadEventPhoto({
          password,
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

  if (!isAuthenticated) {
    return (
      <Card className="mx-auto mt-8 max-w-md">
        <CardHeader>
          <h3 className="text-lg font-semibold">Admin Access</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="password"
            label="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
          />
          <Button onClick={handleAuth} color="primary">
            Access Admin Panel
          </Button>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className="mx-auto mt-8 max-w-md">
      <CardHeader>
        <h3 className="text-lg font-semibold">Upload Photo to Event</h3>
        <p className="text-default-500 text-sm">Event ID: {eventId}</p>
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
          onClick={handleUpload}
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

        <Button
          onClick={() => setIsAuthenticated(false)}
          variant="light"
          size="sm"
          className="w-full">
          Logout
        </Button>
      </CardBody>
    </Card>
  )
}
