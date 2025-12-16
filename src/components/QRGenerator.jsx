import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode } from 'lucide-react'

const QRGenerator = () => {
  // Get the current app URL
  const getAppUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'https://your-app.vercel.app' // Fallback
  }

  const [qrData, setQrData] = useState(getAppUrl())
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [error, setError] = useState('')

  const downloadQR = () => {
    if (!qrImageUrl) return
    
    const link = document.createElement('a')
    link.download = 'christmas-party-qr-code.png'
    link.href = qrImageUrl
    link.click()
  }

  // Generate QR on component mount and when qrData changes
  useEffect(() => {
    const generateQR = async () => {
      try {
        setError('')
        const url = await QRCode.toDataURL(qrData, {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrImageUrl(url)
      } catch (err) {
        setError('Error generating QR code')
        console.error(err)
      }
    }
    
    generateQR()
  }, [qrData])

  const handleGenerate = async () => {
    try {
      setError('')
      const url = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrImageUrl(url)
    } catch (err) {
      setError('Error generating QR code')
      console.error(err)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <QrCode className="w-6 h-6" />
        Generate QR Code
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            App URL (This will be encoded in the QR code)
          </label>
          <input
            type="text"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="https://your-app.vercel.app"
          />
          <p className="text-xs text-gray-400 mt-1">
            This QR code will redirect attendees to the attendance page where they can select their name or register.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          Generate QR Code
        </button>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {qrImageUrl && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg flex justify-center">
              <img src={qrImageUrl} alt="QR Code" className="max-w-full" />
            </div>
            
            <button
              onClick={downloadQR}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download QR Code
            </button>
            
            <div className="bg-blue-900/50 border border-blue-500 text-blue-200 px-4 py-2 rounded text-sm">
              <p className="font-semibold mb-1">How to use:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Download and print this QR code</li>
                <li>Place it at the entrance/registration area</li>
                <li>Attendees scan it with their phone camera</li>
                <li>They will be redirected to the attendance page</li>
                <li>They select their name from the list or register if not in list</li>
                <li>They sign in to complete registration!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QRGenerator

