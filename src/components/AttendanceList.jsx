import { format } from 'date-fns'

const AttendanceList = ({ attendanceList }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'MMM dd, yyyy HH:mm:ss')
    } catch {
      return dateString
    }
  }

  if (attendanceList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No attendees registered yet
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-700 border-b border-gray-600">
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Check-in Time</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map((record) => (
            <tr
              key={record.id}
              className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-200">{record.name}</td>
              <td className="px-4 py-3 text-gray-400">
                {formatDate(record.checked_in_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceList


