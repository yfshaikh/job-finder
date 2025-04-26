interface ApplicationStatusBadgeProps {
    status: string
  }
  
  export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
    let bgColor = "bg-gray-100 text-gray-800"
  
    switch (status) {
      case "Pending":
        bgColor = "bg-yellow-100 text-yellow-800"
        break
      case "Shortlisted":
        bgColor = "bg-blue-100 text-blue-800"
        break
      case "Rejected":
        bgColor = "bg-red-100 text-red-800"
        break
      case "Hired":
        bgColor = "bg-green-100 text-green-800"
        break
    }
  
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    )
  }
  