import { useState, useEffect } from 'react'
import NameSelector from '../components/NameSelector'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { QrCode } from 'lucide-react'
import { defaultNames } from '../utils/namesList'

function Home() {
  const [namesList, setNamesList] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [status, setStatus] = useState('Select your name or register if not in the list')
  const [loading, setLoading] = useState(true)
  const [registeredToday, setRegisteredToday] = useState([])

  // Load names list from Supabase
  useEffect(() => {
    loadNamesList()
    loadRegisteredToday()
  }, [])

  // Reload registered names when attendance changes
  const loadRegisteredToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('attendance')
        .select('name')
        .gte('checked_in_at', `${today}T00:00:00`)
        .lte('checked_in_at', `${today}T23:59:59`)

      if (error) throw error
      setRegisteredToday(data ? data.map(item => item.name) : [])
    } catch (error) {
      console.error('Error loading registered names:', error)
    }
  }

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
      await loadRegisteredToday() // Reload registered list
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              🎄 Christmas Party
            </h1>
            <p className="text-xl text-gray-300">Attendance System</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={importAllNames}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
            >
              Import All Names
            </button>
          <div className="flex gap-3">
            <button
              onClick={importAllNames}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
            >
              Import All Names
            </button>
            <Link
              to="/qr-generator"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <QrCode className="w-5 h-5" />
              Generate QR Code
            </Link>
          </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
            <div className="text-xl mt-4 text-gray-300">Loading...</div>
          </div>
        ) : (
          <>
            {/* Welcome Message */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center shadow-xl">
                <p className="text-lg text-gray-100 leading-relaxed">
                  Welcome! Please select your name from the list below to sign in, or register if you're not in the list.
                </p>
              </div>
            </div>

            {/* Name Selection Panel */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Select Your Name or Register
                </h2>
                <NameSelector
                  namesList={namesList.filter(name => !registeredToday.includes(name))}
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
                  registeredNames={registeredToday}
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

