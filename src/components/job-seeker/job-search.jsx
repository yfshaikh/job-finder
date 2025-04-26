"use client"



import { useState } from "react"
import { useRouter } from "next/navigation"
import { searchJobs } from "@/app/actions/job-seeker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function JobSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    const result = await searchJobs(query)

    setIsLoading(false)

    if (result.success) {
      setSearchResults(result.data)
    } else {
      setSearchResults([])
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex w-full max-w-lg space-x-2">
        <Input
          type="text"
          placeholder="Search for jobs, companies, or locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
        </Button>
      </form>

      {hasSearched && (
        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p className="text-muted-foreground">No jobs found matching your search criteria.</p>
          ) : (
            <p className="text-muted-foreground">Found {searchResults.length} jobs matching your search.</p>
          )}
        </div>
      )}
    </div>
  )
}
