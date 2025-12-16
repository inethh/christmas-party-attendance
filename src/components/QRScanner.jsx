import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, X } from 'lucide-react'

const QRScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState('')
  const html5QrCodeRef = useRef(null)
  const scannerIdRef = useRef(null)

  const startScanning = async () => {
    try {
      setError('')
      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      }

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText)
        },
        (errorMessage) => {
          // Ignore errors - they're just part of the scanning process
        }
      )

      setIsScanning(true)
    } catch (err) {
      console.error('Error starting scanner:', err)
      setError('Failed to start camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
      }
      setIsScanning(false)
      setError('')
    } catch (err) {
      console.error('Error stopping scanner:', err)
    }
  }

  const handleScanSuccess = (decodedText) => {
    stopScanning()
    onScan(decodedText)
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div
        id="qr-reader"
        className={`w-full ${isScanning ? 'min-h-[300px]' : 'min-h-[200px]'} bg-gray-900 rounded-lg overflow-hidden`}
      ></div>

      {!isScanning && (
        <div className="text-center text-gray-400 py-8">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Click "Start Scanner" to begin</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <button
        onClick={isScanning ? stopScanning : startScanning}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          isScanning
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isScanning ? (
          <>
            <X className="w-5 h-5" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="w-5 h-5" />
            Start Scanner
          </>
        )}
      </button>
    </div>
  )
}

export default QRScanner


