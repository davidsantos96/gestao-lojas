import { useState, useMemo } from 'react'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export function usePagination(items, defaultPageSize = 10) {
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(defaultPageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  // Reset to page 1 whenever pageSize changes or items count changes dramatically
  const safePage = Math.min(page, totalPages)

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, safePage, pageSize])

  function goTo(p)   { setPage(Math.max(1, Math.min(p, totalPages))) }
  function next()    { goTo(safePage + 1) }
  function prev()    { goTo(safePage - 1) }

  function changePageSize(newSize) {
    setPageSize(newSize)
    setPage(1)
  }

  return {
    paginatedItems,
    page: safePage,
    pageSize,
    totalPages,
    totalItems: items.length,
    goTo,
    next,
    prev,
    changePageSize,
    PAGE_SIZE_OPTIONS,
    from: items.length === 0 ? 0 : (safePage - 1) * pageSize + 1,
    to:   Math.min(safePage * pageSize, items.length),
  }
}
