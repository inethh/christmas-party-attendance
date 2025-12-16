import { useState, useEffect } from 'react'
import NameSelector from '../components/NameSelector'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'

function Home() {
  const [namesList, setNamesList] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [status, setStatus] = useState('Select your name or register if not in the list')
  const [loading, setLoading] = useState(true)

  // Load names list from Supabase
  useEffect(() => {
    loadNamesList()
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
    } catch (error) {
      console.error('Error registering attendance:', error)
      setStatus('Error registering attendance')
    }
  }

  const handleAddAndRegister = async (nameFromInput) => {
    const nameToAdd = nameFromInput || selectedName
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
    setSelectedName('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            🎄 Christmas Party Attendance System 🎄
          </h1>
          <Link
            to="/qr-generator"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <QrCode className="w-5 h-5" />
            Generate QR Code
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-xl">Loading...</div>
          </div>
        ) : (
          <>
            {/* Welcome Message */}
            <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-6 mb-6 text-center">
              <p className="text-lg text-blue-200">
                Welcome! Please select your name from the list below to sign in, or register if you're not in the list.
              </p>
            </div>

            {/* Name Selection Panel */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Select Your Name or Register
                </h2>
                <NameSelector
                  namesList={namesList}
                  selectedName={selectedName}
                  scannedName=""
                  onSelectName={setSelectedName}
                  onRegister={(name) => {
                    registerAttendance(name)
                    setSelectedName('')
                  }}
                  onAddAndRegister={handleAddAndRegister}
                  status={status}
                  qrScanned={false}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home

