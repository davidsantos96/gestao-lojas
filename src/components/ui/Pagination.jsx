import { useContext } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { Wrap, Info, Controls, PageBtn, Ellipsis, PageSizeWrap, PageSizeBtn } from './PaginationStyles'

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p)
  }
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

export function Pagination({ page, pageSize, totalPages, totalItems, from, to, goTo, next, prev, changePageSize, PAGE_SIZE_OPTIONS }) {
  const { theme } = useContext(ThemeContext)
  const pages = buildPages(page, totalPages)

  if (totalItems === 0) return null

  return (
    <Wrap theme={theme}>
      <PageSizeWrap theme={theme}>
        <span>Itens por página:</span>
        {PAGE_SIZE_OPTIONS.map(s => (
          <PageSizeBtn
            key={s}
            theme={theme}
            $active={pageSize === s}
            onClick={() => changePageSize(s)}
          >
            {s}
          </PageSizeBtn>
        ))}
      </PageSizeWrap>

      <Info theme={theme}>
        {from}–{to} de {totalItems}
      </Info>

      <Controls>
        <PageBtn theme={theme} onClick={prev} disabled={page === 1} title="Página anterior">
          <ChevronLeft size={14} />
        </PageBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <Ellipsis key={`e${i}`} theme={theme}>…</Ellipsis>
          ) : (
            <PageBtn
              key={p}
              theme={theme}
              $active={p === page}
              onClick={() => goTo(p)}
            >
              {p}
            </PageBtn>
          )
        )}

        <PageBtn theme={theme} onClick={next} disabled={page === totalPages} title="Próxima página">
          <ChevronRight size={14} />
        </PageBtn>
      </Controls>
    </Wrap>
  )
}
