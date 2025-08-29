// src/app/search/page.js
'use client'
export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import SearchContent from './SearchContent'

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">載入中…</div>}>
      <SearchContent />
    </Suspense>
  )
}

