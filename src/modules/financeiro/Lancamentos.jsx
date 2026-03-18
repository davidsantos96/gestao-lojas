import { fmtBRL } from '../../utils/format'
import { Skeleton } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

const TIPO_STYLE = {
  RECEITA: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  DESPESA: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
}

export function Lancamentos({ lancamentos = [], total = 0, loading, error, onRefetch }) {
  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  )

  if (error) return (
    <ErrorState message={error} onRetry={onRefetch} />
  )

  if (!lancamentos.length) return (
    <EmptyState message="Nenhum lançamento encontrado." />
  )

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{total} lançamento{total !== 1 ? 's' : ''}</p>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Descrição</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
            {lancamentos.map((l) => {
              const style = TIPO_STYLE[l.tipo] ?? TIPO_STYLE.DESPESA
              return (
                <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {l.data ? new Date(l.data).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                      {l.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">{l.descricao}</td>
                  <td className={`px-4 py-3 text-right font-semibold tabular-nums ${style.text}`}>
                    {l.tipo === 'DESPESA' ? '−' : '+'}{fmtBRL(l.valor)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
