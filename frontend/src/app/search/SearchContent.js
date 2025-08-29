// src/app/search/SearchContent.js
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { concertsData } from '@/data/concerts'
import ConcertCard from '@/components/concerts/ConcertCard'

export default function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const keyword = searchParams.get('keyword')?.trim().toLowerCase() || ''

  const [filteredConcerts, setFilteredConcerts] = useState([])

  useEffect(() => {
    if (!keyword) {
      setFilteredConcerts([])
      return
    }
    const filtered = concertsData.filter(concert => {
      const title  = concert.title.toLowerCase()
      const artist = (concert.artist || '').toLowerCase()
      const date   = String(concert.date).toLowerCase()
      return (
        title.includes(keyword) ||
        artist.includes(keyword) ||
        date.includes(keyword)
      )
    })
    setFilteredConcerts(filtered)
  }, [keyword])

  useEffect(() => {
    if (!keyword) {
      router.push('/')
    }
  }, [keyword, router])

  return (
    <main className="container-xxl my-5">
      <h1 className="mb-4 text-center">搜尋結果：「{keyword}」</h1>
      {filteredConcerts.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
          {filteredConcerts.map(concert => (
            <div key={concert.id} className="col d-flex justify-content-center">
              <ConcertCard
                concert={concert}
                onClick={() => router.push(`/info/${concert.id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted fs-5">
          很抱歉，找不到符合條件的演唱會。
        </p>
      )}
    </main>
  )
}

