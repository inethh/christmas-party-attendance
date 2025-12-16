import { useState, useEffect } from 'react'
import QRScanner from './components/QRScanner'
import NameSelector from './components/NameSelector'
import AttendanceList from './components/AttendanceList'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [namesList, setNamesList] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [scannedName, setScannedName] = useState('')
  const [status, setStatus] = useState('Ready to scan QR code')
  const [attendanceList, setAttendanceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrScanned, setQrScanned] = useState(false)

  // Load names list from Supabase
  useEffect(() => {
    loadNamesList()
    loadAttendanceList()
  }, [])

  const loadNamesList = async () => {
    try {
      const { data, error } = await supabase
        .from('names_list')
        .select('name')
        .order('name')

      if (error) throw error

      if (data && data.length > 0) {
        setNamesList(data.map(item => item.name))
      } else {
        // Initialize with default names if table is empty
        const defaultNames = [
          "John Doe", "Jane Smith", "Bob Johnson", "Alice Williams",
          "Charlie Brown", "Diana Prince", "Edward Norton", "Fiona Apple"
        ]
        await initializeNamesList(defaultNames)
        setNamesList(defaultNames)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading names list:', error)
      setStatus('Error loading names list')
      setLoading(false)
    }
  }

  const initializeNamesList = async (names) => {
    try {
      const namesToInsert = names.map(name => ({ name }))
      const { error } = await supabase
        .from('names_list')
        .insert(namesToInsert)
      
      if (error) throw error
    } catch (error) {
      console.error('Error initializing names list:', error)
    }
  }

  const loadAttendanceList = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('checked_in_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setAttendanceList(data || [])
    } catch (error) {
      console.error('Error loading attendance list:', error)
    }
  }

  const handleQRScan = async (qrData) => {
    // QR code scanned - show name selection interface
    setQrScanned(true)
    setStatus('QR Code scanned! Please select your name from the list below.')
    
    // Scroll to name selector (optional - can be enhanced with ref)
    setTimeout(() => {
      const nameSelector = document.querySelector('[data-name-selector]')
      if (nameSelector) {
        nameSelector.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const addNameToList = async (name) => {
    if (!name.trim()) {
      setStatus('Please enter a name')
      return
    }

    if (namesList.includes(name)) {
      setStatus('Name already exists in list')
      return
    }

    try {
      const { error } = await supabase
        .from('names_list')
        .insert([{ name }])

      if (error) throw error

      setNamesList([...namesList, name].sort())
      setStatus(`Added ${name} to list`)
      return true
    } catch (error) {
      console.error('Error adding name:', error)
      setStatus('Error adding name to list')
      return false
    }
  }

  const registerAttendance = async (name) => {
    if (!name.trim()) {
      setStatus('Please select or enter a name')
      return
    }

    try {
      // Check if already registered today
      const today = new Date().toISOString().split('T')[0]
      const { data: existing } = await supabase
        .from('attendance')
        .select('*')
        .eq('name', name)
        .gte('checked_in_at', `${today}T00:00:00`)
        .lte('checked_in_at', `${today}T23:59:59`)

      if (existing && existing.length > 0) {
        setStatus(`${name} is already registered for today`)
        return
      }

      // Register attendance
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            name,
            checked_in_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      setStatus(`${name} registered successfully!`)
      setSelectedName('')
      setScannedName('')
      setQrScanned(false)
      await loadAttendanceList()
    } catch (error) {
      console.error('Error registering attendance:', error)
      setStatus('Error registering attendance')
    }
  }

  const handleAddAndRegister = async (nameFromInput) => {
    const nameToAdd = nameFromInput || scannedName || selectedName
    if (!nameToAdd || !nameToAdd.trim()) {
      setStatus('Please enter a name')
      return
    }

    // Add to list if not exists
    if (!namesList.includes(nameToAdd)) {
      const added = await addNameToList(nameToAdd)
      if (!added) return
    }

    // Register attendance
    await registerAttendance(nameToAdd)
    setScannedName('')
    setSelectedName('')
    setQrScanned(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎄 Christmas Party Attendance System 🎄
        </h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* QR Scanner Panel */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>
                <QRScanner onScan={handleQRScan} />
              </div>

              {/* Name Selection Panel */}
              <div 
                className={`bg-gray-800 rounded-lg p-6 shadow-lg transition-all duration-300 ${
                  qrScanned ? 'ring-4 ring-green-500 ring-opacity-50' : ''
                }`}
                data-name-selector
              >
                <h2 className="text-2xl font-bold mb-4">
                  Select Your Name
                  {qrScanned && (
                    <span className="ml-2 text-sm text-green-400 font-normal">
                      (QR Code Scanned ✓)
                    </span>
                  )}
                </h2>
                <NameSelector
                  namesList={namesList}
                  selectedName={selectedName}
                  scannedName={scannedName}
                  onSelectName={setSelectedName}
                  onRegister={(name) => {
                    registerAttendance(name)
                    setSelectedName('')
                    setScannedName('')
                    setQrScanned(false)
                  }}
                  onAddAndRegister={handleAddAndRegister}
                  status={status}
                  qrScanned={qrScanned}
                />
              </div>
            </div>

            {/* Attendance List */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Registered Attendees</h2>
                <button
                  onClick={loadAttendanceList}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition-colors"
                >
                  Refresh List
                </button>
              </div>
              <AttendanceList attendanceList={attendanceList} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App

