import { AlertTriangle, Package, DollarSign, ChevronRight, CheckCircle } from 'lucide-react'
import { C } from '../../constants/theme'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Skeleton } from '../../components/ui/Skeleton'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function diasAteVencer(dataStr) {
  if (!dataStr) return null
  const [d, m, y]  = dataStr.split('/').map(Number)
  const venc        = new Date(y, m - 1, d)
  const hoje        = new Date()
  hoje.setHours(0, 0, 0, 0)
  return Math.floor((venc - hoje) / 86400000)
}

function urgenciaFinanceira(conta) {
  if (conta.status === 'vencido') return 'vencido'
  const dias = diasAteVencer(conta.vencimento)
  if (dias !== null && dias <= 3)  return 'critico'
  if (dias !== null && dias <= 7)  return 'atencao'
  return null
}

const ESTOQUE_CONFIG = {
  out: { label: 'Zerado',    color: C.red,    bg: 'rgba(255,91,107,.12)',  prioridade: 0 },
  low: { label: 'Baixo',     color: C.yellow, bg: 'rgba(247,201,72,.12)',  prioridade: 1 },
}

const FIN_CONFIG = {
  vencido: { label: 'Vencido',      color: C.red,    bg: 'rgba(255,91,107,.12)' },
  critico: { label: 'Vence hoje/amanhã', color: C.red,    bg: 'rgba(255,91,107,.10)' },
  atencao: { label: 'Vence em breve',    color: C.yellow, bg: 'rgba(247,201,72,.12)' },
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Secao({ icone: Icon, cor, titulo, contagem, children, onVerTodos }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: `${cor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={12} color={cor} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{titulo}</span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', padding: '1px 7px', borderRadius: 99, background: `${cor}18`, color: cor, border: `1px solid ${cor}33` }}>
            {contagem}
          </span>
        </div>
        {onVerTodos && (
          <button onClick={onVerTodos} style={{ fontSize: 11, color: C.blue, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            Ver todos <ChevronRight size={11} />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </div>
  )
}

function AlertaItem({ esquerda, direita, tag, cor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 12px', borderRadius: 8,
      background: C.s2, border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${cor}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {esquerda.titulo}
        </div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{esquerda.sub}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
        {direita && <span style={{ fontSize: 13, fontWeight: 700, color: cor }}>{direita}</span>}
        <Tag color={tag.color} bg={tag.bg}>{tag.label}</Tag>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function PainelAlertas({ produtos = [], contasPagar = [], loading, setPage }) {
  const alertasEstoque = produtos
    .filter(p => p.status !== 'ok')
    .sort((a, b) => ESTOQUE_CONFIG[a.status].prioridade - ESTOQUE_CONFIG[b.status].prioridade)

  const alertasFinanceiros = contasPagar
    .filter(c => c.status !== 'pago' && urgenciaFinanceira(c) !== null)
    .sort((a, b) => {
      const ordem = { vencido: 0, critico: 1, atencao: 2 }
      return ordem[urgenciaFinanceira(a)] - ordem[urgenciaFinanceira(b)]
    })

  const totalAlertas = alertasEstoque.length + alertasFinanceiros.length

  return (
    <Card style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header do painel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Central de Alertas</span>
          {!loading && totalAlertas > 0 && (
            <span style={{ fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 99, background: 'rgba(255,91,107,.15)', color: C.red, border: `1px solid rgba(255,91,107,.3)`, fontWeight: 700 }}>
              {totalAlertas} pendentes
            </span>
          )}
        </div>
        {!loading && totalAlertas === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.accent }}>
            <CheckCircle size={13} /> Tudo em ordem
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={52} radius={8} />)}
        </div>
      )}

      {/* Sem alertas */}
      {!loading && totalAlertas === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: C.muted, fontSize: 12 }}>
          Nenhum item precisa de atenção agora.
        </div>
      )}

      {/* Alertas de Estoque */}
      {!loading && alertasEstoque.length > 0 && (
        <>
          <Secao
            icone={Package}
            cor={C.red}
            titulo="Estoque"
            contagem={alertasEstoque.length}
            onVerTodos={() => setPage('estoque')}
          >
            {alertasEstoque.map(p => {
              const cfg = ESTOQUE_CONFIG[p.status]
              return (
                <AlertaItem
                  key={p.id}
                  cor={cfg.color}
                  esquerda={{ titulo: p.nome, sub: `Código ${p.sku} · mínimo ${p.minimo} un.` }}
                  direita={`${p.estoque} un.`}
                  tag={cfg}
                />
              )
            })}
          </Secao>
          {alertasFinanceiros.length > 0 && (
            <div style={{ height: 1, background: C.border, margin: '14px 0' }} />
          )}
        </>
      )}

      {/* Alertas Financeiros */}
      {!loading && alertasFinanceiros.length > 0 && (
        <Secao
          icone={DollarSign}
          cor={C.yellow}
          titulo="Financeiro"
          contagem={alertasFinanceiros.length}
          onVerTodos={() => setPage('financeiro')}
        >
          {alertasFinanceiros.map(c => {
            const urg = urgenciaFinanceira(c)
            const cfg = FIN_CONFIG[urg]
            const dias = diasAteVencer(c.vencimento)
            const subDias = urg === 'vencido'
              ? `Venceu em ${c.vencimento}`
              : dias === 0 ? 'Vence hoje'
              : dias === 1 ? 'Vence amanhã'
              : `Vence em ${dias} dias · ${c.vencimento}`
            return (
              <AlertaItem
                key={c.id}
                cor={cfg.color}
                esquerda={{ titulo: c.descricao, sub: `${subDias} · ${c.categoria}` }}
                direita={fmtBRL(c.valor)}
                tag={cfg}
              />
            )
          })}
        </Secao>
      )}
    </Card>
  )
}
