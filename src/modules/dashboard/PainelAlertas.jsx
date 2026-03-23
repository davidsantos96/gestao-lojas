import { useContext } from 'react'
import { AlertTriangle, Package, DollarSign, ChevronRight, CheckCircle } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import { fmtBRL } from '../../utils/format'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'
import { Skeleton } from '../../components/ui/Skeleton'
import {
  AlertsCentralHeader, AlertsTitleWrap, AlertsCentralTitle, AlertsBadge, AlertsSuccess, EmptyAlerts,
  SectionWrap, SectionHeader, SectionTitleWrap, SectionIconBox, SectionTitle, SectionCount, SeeAllBtn,
  AlertaCard, AlertaRight, AlertaValue, Divider, ListWrap, ListInfo, ListTitle, ListSub
} from './DashboardStyles'

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

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Secao({ icone: Icon, cor, titulo, contagem, children, onVerTodos }) {
  return (
    <SectionWrap>
      <SectionHeader>
        <SectionTitleWrap>
          <SectionIconBox $cor={cor}>
            <Icon size={12} color={cor} />
          </SectionIconBox>
          <SectionTitle>{titulo}</SectionTitle>
          <SectionCount $cor={cor}>
            {contagem}
          </SectionCount>
        </SectionTitleWrap>
        {onVerTodos && (
          <SeeAllBtn onClick={onVerTodos}>
            Ver todos <ChevronRight size={11} />
          </SeeAllBtn>
        )}
      </SectionHeader>
      <ListWrap>
        {children}
      </ListWrap>
    </SectionWrap>
  )
}

function AlertaItem({ esquerda, direita, tag, cor }) {
  return (
    <AlertaCard $cor={cor}>
      <ListInfo>
        <ListTitle>
          {esquerda.titulo}
        </ListTitle>
        <ListSub>{esquerda.sub}</ListSub>
      </ListInfo>
      <AlertaRight>
        {direita && <AlertaValue $cor={cor}>{direita}</AlertaValue>}
        <Tag color={tag.color} bg={tag.bg}>{tag.label}</Tag>
      </AlertaRight>
    </AlertaCard>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function PainelAlertas({ produtos = [], contasPagar = [], loading, setPage }) {
  const { theme } = useContext(ThemeContext)
  
  const ESTOQUE_CONFIG = {
    out: { label: 'Zerado',    color: theme.colors.red,    bg: 'rgba(255,91,107,.12)',  prioridade: 0 },
    low: { label: 'Baixo',     color: theme.colors.yellow, bg: 'rgba(247,201,72,.12)',  prioridade: 1 },
  }

  const FIN_CONFIG = {
    vencido: { label: 'Vencido',      color: theme.colors.red,    bg: 'rgba(255,91,107,.12)' },
    critico: { label: 'Vence hoje/amanhã', color: theme.colors.red,    bg: 'rgba(255,91,107,.10)' },
    atencao: { label: 'Vence em breve',    color: theme.colors.yellow, bg: 'rgba(247,201,72,.12)' },
  }

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
      <AlertsCentralHeader>
        <AlertsTitleWrap>
          <AlertsCentralTitle>Central de Alertas</AlertsCentralTitle>
          {!loading && totalAlertas > 0 && (
            <AlertsBadge>
              {totalAlertas} pendentes
            </AlertsBadge>
          )}
        </AlertsTitleWrap>
        {!loading && totalAlertas === 0 && (
          <AlertsSuccess>
            <CheckCircle size={13} /> Tudo em ordem
          </AlertsSuccess>
        )}
      </AlertsCentralHeader>

      {/* Loading */}
      {loading && (
        <ListWrap>
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={52} radius={8} />)}
        </ListWrap>
      )}

      {/* Sem alertas */}
      {!loading && totalAlertas === 0 && (
        <EmptyAlerts>
          Nenhum item precisa de atenção agora.
        </EmptyAlerts>
      )}

      {/* Alertas de Estoque */}
      {!loading && alertasEstoque.length > 0 && (
        <>
          <Secao
            icone={Package}
            cor={theme.colors.red}
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
            <Divider />
          )}
        </>
      )}

      {/* Alertas Financeiros */}
      {!loading && alertasFinanceiros.length > 0 && (
        <Secao
          icone={DollarSign}
          cor={theme.colors.yellow}
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

