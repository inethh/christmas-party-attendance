import { useState, useMemo, useEffect } from 'react'
import { Search, UserPlus, CheckCircle } from 'lucide-react'

const NameSelector = ({
  namesList,
  selectedName,
  scannedName,
  onSelectName,
  onRegister,
  onAddAndRegister,
  status,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [newName, setNewName] = useState(scannedName || '')

  // Update newName when scannedName changes
  useEffect(() => {
    if (scannedName) {
      setNewName(scannedName)
    }
  }, [scannedName])

  const filteredNames = useMemo(() => {
    if (!searchTerm) return namesList.sort()
    return namesList
      .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort()
  }, [namesList, searchTerm])

  const handleNameClick = (name) => {
    onSelectName(name)
  }

  const handleRegister = () => {
    if (selectedName) {
      onRegister(selectedName)
    } else {
      onAddAndRegister()
    }
  }

  const handleAddAndRegister = () => {
    if (newName.trim()) {
      onAddAndRegister(newName.trim())
      setNewName('')
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Names List */}
      <div className="bg-gray-700 rounded-lg border border-gray-600 max-h-64 overflow-y-auto">
        {filteredNames.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No names found
          </div>
        ) : (
          <ul className="divide-y divide-gray-600">
            {filteredNames.map((name) => (
              <li
                key={name}
                onClick={() => handleNameClick(name)}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedName === name
                    ? 'bg-green-600 text-white'
                    : 'hover:bg-gray-600 text-gray-200'
                }`}
              >
                {name}
                {selectedName === name && (
                  <CheckCircle className="inline-block ml-2 w-4 h-4" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add New Name Section */}
      <div className="space-y-2">
        <label className="block text-sm text-gray-300">
          Name not in list?
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddAndRegister()
              }
            }}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddAndRegister}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Add & Register
          </button>
        </div>
      </div>

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={!selectedName && !newName.trim()}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
          selectedName || newName.trim()
            ? 'bg-orange-600 hover:bg-orange-700 text-white'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        Register Attendance
      </button>

      {/* Status Message */}
      <div
        className={`p-3 rounded-lg text-sm ${
          status.includes('successfully') || status.includes('Ready')
            ? 'bg-green-900/50 text-green-200 border border-green-500'
            : status.includes('Error') || status.includes('already')
            ? 'bg-red-900/50 text-red-200 border border-red-500'
            : 'bg-yellow-900/50 text-yellow-200 border border-yellow-500'
        }`}
      >
        {status}
      </div>
    </div>
  )
}

export default NameSelector

