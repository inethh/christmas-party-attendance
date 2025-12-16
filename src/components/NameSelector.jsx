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
  qrScanned = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [newName, setNewName] = useState('')

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
    <div className="space-y-6">
      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          type="text"
          placeholder="Search names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-lg"
        />
      </div>

      {/* Names List */}
      <div className={`bg-gray-700/30 backdrop-blur-sm rounded-xl border max-h-72 overflow-y-auto transition-all shadow-lg ${
        qrScanned ? 'border-green-500 border-2 ring-2 ring-green-500/50' : 'border-gray-600/50'
      }`}>
        {filteredNames.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-lg">No names available</p>
            <p className="text-sm mt-2">All names have been registered or no matches found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-600/30">
            {filteredNames.map((name) => (
              <li
                key={name}
                onClick={() => handleNameClick(name)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedName === name
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-[1.02]'
                    : 'hover:bg-gray-600/50 text-gray-200 hover:transform hover:translate-x-1'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{name}</span>
                  {selectedName === name && (
                    <CheckCircle className="w-5 h-5 animate-pulse" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add New Name Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">
          Name not in list?
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter your name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddAndRegister()
              }
            }}
            className="flex-1 px-4 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-lg"
          />
          <button
            onClick={handleAddAndRegister}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
          selectedName || newName.trim()
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white hover:shadow-xl transform hover:scale-105'
            : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        Register Attendance
      </button>

      {/* Status Message */}
      <div
        className={`p-4 rounded-xl text-sm font-medium backdrop-blur-sm shadow-lg transition-all duration-300 ${
          status.includes('successfully')
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-500/50'
            : status.includes('Error') || status.includes('already')
            ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-200 border border-red-500/50'
            : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-200 border border-yellow-500/50'
        }`}
      >
        {status}
      </div>
    </div>
  )
}

export default NameSelector

