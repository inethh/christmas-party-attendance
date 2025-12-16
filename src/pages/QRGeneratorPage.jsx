import QRGenerator from '../components/QRGenerator'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function QRGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Attendance System
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            🎄 Generate QR Code 🎄
          </h1>
          <QRGenerator />
        </div>
      </div>
    </div>
  )
}

export default QRGeneratorPage


