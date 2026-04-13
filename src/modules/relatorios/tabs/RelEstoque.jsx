import { useContext, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Boxes, PackageX, AlertTriangle, BarChart2, Info,
} from 'lucide-react'
import { ThemeContext }  from '../../../contexts/ThemeContext'
import { useProdutos }   from '../../../hooks/useProdutos'
import { useMovimentos } from '../../../hooks/useMovimentos'
import { useAbc }        from '../../../hooks/useRelatorios'
import { KPI }           from '../../../components/ui/KPI'
import { SkeletonKPI }   from '../../../components/ui/Skeleton'
import { Card }          from '../../../components/ui/Card'
import { Tag }           from '../../../components/ui/Tag'
import { ChartTooltip }  from '../../../components/ui/ChartTooltip'
import { Pagination }    from '../../../components/ui/Pagination'
import { usePagination } from '../../../hooks/usePagination'
import { fmtBRL }        from '../../../utils/format'

import {
  produtos  as MOCK_PRODS,
  movimentos as MOCK_MOVS,
} from '../../../data/mock'

import {
  KpiGrid, ContentGrid, SectionTitle, SubLabel,
  TableWrap, Table, Th, Td, Tr, ProductName, ProductSku,
  AbcBar, AbcTrack, AbcFill,
  DaysBadge, LegendRow, LegendDot,
} from './RelEstoqueStyles'

// ── Constantes ────────────────────────────────────────────────────────────────

const ABC_CONFIG = {
  A: { color: '#00d9a8', bg: 'rgba(0,217,168,.12)'   },
  B: { color: '#f7c948', bg: 'rgba(247,201,72,.12)'  },
  C: { color: '#6b738f', bg: 'rgba(107,115,143,.12)' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Parser para 'DD/MM/YYYY' → Date (→RD-5: new Date('DD/MM/YYYY') = Invalid Date no V8)
function parseBR(str) {
  if (!str) return null
  const [d, m, y] = str.split('/')
  if (!d || !m || !y) return null
  return new Date(Number(y), Number(m) - 1, Number(d))
}

// Curva ABC por valor em estoque (→RD-2: join por nome normalizado, não por ID)
function calcABC(prods) {
  const sorted = [...prods]
    .map(p => ({ ...p, valorEstoque: (p.estoque ?? 0) * (p.custo ?? 0) }))
    .sort((a, b) => b.valorEstoque - a.valorEstoque)

  const total = sorted.reduce((s, p) => s + p.valorEstoque, 0)
  let acum = 0

  return sorted.map(p => {
    acum += p.valorEstoque
    const pct = total > 0 ? (acum / total) * 100 : 0
    const cls = pct <= 80 ? 'A' : pct <= 95 ? 'B' : 'C'
    return { ...p, pctAcum: pct, cls, sharePct: total > 0 ? (p.valorEstoque / total) * 100 : 0 }
  })
}

// Estoque morto: sem movimento de 'saida' nos últimos N dias (→RD-2 + →RD-5)
function calcDeadStock(prods, movs, diasLimite = 30) {
  const hoje = new Date()

  // Última saída por produto (join normalizado)
  const lastSaida = {}
  movs
    .filter(m => m.tipo === 'saida' && m.qtd > 0)
    .forEach(m => {
      const key  = m.produto?.toLowerCase().trim()
      const date = parseBR(m.data)
      if (!date) return
      if (!lastSaida[key] || date > lastSaida[key]) lastSaida[key] = date
    })

  return prods
    .filter(p => p.estoque > 0) // apenas com estoque (senão já é ruptura)
    .map(p => {
      const key  = p.nome?.toLowerCase().trim()
      const last = lastSaida[key] ?? null
      const dias = last
        ? Math.floor((hoje - last) / 86400000)
        : 9999 // nunca teve saída registrada
      return { ...p, diasParado: dias, ultimaSaida: last }
    })
    .filter(p => p.diasParado >= diasLimite)
    .sort((a, b) => b.diasParado - a.diasParado)
}

// Agrega movimentos por mês para o BarChart (→RD-5: parser de data manual)
function calcMovPorMes(movs) {
  const acc = {}
  movs.forEach(m => {
    const date = parseBR(m.data)
    if (!date) return
    const key = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    if (!acc[key]) acc[key] = { mes: key, entradas: 0, saidas: 0 }
    if (m.tipo === 'entrada') acc[key].entradas += Math.abs(m.qtd)
    if (m.tipo === 'saida')   acc[key].saidas   += Math.abs(m.qtd)
  })
  // Ordena cronologicamente pela data do primeiro movimento do mês
  return Object.values(acc)
}

// Giro por categoria: sum(saídas) / sum(estoque atual) por categoria
function calcGiroCat(prods, movs) {
  const saidas = {}
  movs
    .filter(m => m.tipo === 'saida')
    .forEach(m => {
      const prod = prods.find(p => p.nome?.toLowerCase().trim() === m.produto?.toLowerCase().trim())
      if (!prod) return
      const cat = prod.categoria
      saidas[cat] = (saidas[cat] ?? 0) + Math.abs(m.qtd)
    })

  const estoque = {}
  prods.forEach(p => {
    estoque[p.categoria] = (estoque[p.categoria] ?? 0) + p.estoque
  })

  return Object.keys(estoque).map(cat => ({
    categoria: cat,
    giro: estoque[cat] > 0 ? +(saidas[cat] ?? 0 / estoque[cat]).toFixed(2) : 0,
    saidas: saidas[cat] ?? 0,
    estoque: estoque[cat],
  }))
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RelEstoque({ period }) {
  const { theme } = useContext(ThemeContext)

  const { produtos: prodsRaw, loading: lp } = useProdutos()
  const { movimentos: movsRaw, loading: lm } = useMovimentos()
  const { dados: abcApiData, meta: abcMeta, loading: abcLoading } = useAbc(period)

  const prods = prodsRaw?.length ? prodsRaw : MOCK_PRODS
  const movs  = movsRaw?.length  ? movsRaw  : MOCK_MOVS

  const initialLoad = (lp || lm) && !prodsRaw?.length

  // ── Dados derivados ───────────────────────────────────────────────────────
  const deadStock  = useMemo(() => calcDeadStock(prods, movs),  [prods, movs])
  const movPorMes  = useMemo(() => calcMovPorMes(movs),         [movs])
  const giroCat    = useMemo(() => calcGiroCat(prods, movs),    [prods, movs])
  const rupturas   = useMemo(() => prods.filter(p => p.status !== 'ok'), [prods])

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalValor  = useMemo(() => prods.reduce((s, p) => s + (p.estoque ?? 0) * (p.custo ?? 0), 0), [prods])
  const countA      = abcApiData.filter(p => p.classe === 'A').length
  const valorA      = abcApiData.filter(p => p.classe === 'A').reduce((s, p) => s + p.receita, 0)

  const abcPagination      = usePagination(abcApiData)
  const rupturasPagination = usePagination(rupturas)
  const deadStockPagination = usePagination(deadStock)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* KPIs */}
      <KpiGrid>
        {initialLoad
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)
          : <>
              <KPI
                label="Valor total em estoque"
                value={fmtBRL(totalValor)}
                sub="custo × unidades"
                color={theme.colors.blue}
                icon={Boxes}
              />
              <KPI
                label="Itens Curva A"
                value={`${countA} SKUs`}
                sub={`${fmtBRL(valorA)} — ~80% do valor`}
                color={theme.colors.accent}
                icon={BarChart2}
              />
              <KPI
                label="Rupturas / Críticos"
                value={`${rupturas.length} produto${rupturas.length !== 1 ? 's' : ''}`}
                sub={`${prods.filter(p => p.status === 'out').length} zerado(s)`}
                color={rupturas.length > 0 ? theme.colors.red : theme.colors.accent}
                icon={AlertTriangle}
              />
              <KPI
                label="Estoque morto (≥30d)"
                value={`${deadStock.length} produto${deadStock.length !== 1 ? 's' : ''}`}
                sub="sem saída registrada"
                color={deadStock.length > 0 ? theme.colors.yellow : theme.colors.accent}
                icon={PackageX}
              />
            </>
        }
      </KpiGrid>

      {/* Curva ABC + BarChart movimentos */}
      <ContentGrid>
        {/* BarChart: entradas vs saídas por mês */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Movimentações por Mês
            <LegendRow>
              <span><LegendDot $color={theme.colors.accent} />Entradas</span>
              <span><LegendDot $color={theme.colors.blue}   />Saídas</span>
            </LegendRow>
          </SectionTitle>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={movPorMes} barGap={4} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
              <XAxis
                dataKey="mes"
                tick={{ fill: theme.colors.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.colors.muted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="entradas" name="Entradas" fill={theme.colors.accent} radius={[4,4,0,0]} barSize={24} fillOpacity={0.85} />
              <Bar dataKey="saidas"   name="Saídas"   fill={theme.colors.blue}   radius={[4,4,0,0]} barSize={24} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Giro por categoria */}
        <Card style={{ padding: 24 }}>
          <SectionTitle>
            Giro por Categoria
            <SubLabel>saídas ÷ estoque atual</SubLabel>
          </SectionTitle>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={giroCat} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: theme.colors.muted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="categoria"
                tick={{ fill: theme.colors.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="saidas" name="Saídas (un)" fill={theme.colors.purple} radius={[0,4,4,0]} barSize={20} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </ContentGrid>

      {/* Curva ABC */}
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '20px 20px 0' }}>
          <SectionTitle>
            Curva ABC — por Receita de Vendas
            <SubLabel>A = top 80% · B = 80–95% · C = acima de 95% · base: receita no período</SubLabel>
          </SectionTitle>
        </div>
        {abcMeta?.periodo_real_inicio && period?.inicio && abcMeta.periodo_real_inicio > period.inicio && (
          <div style={{ padding: '0 20px 12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6,
              background: 'rgba(247,201,72,.1)', border: '1px solid rgba(247,201,72,.25)',
              fontSize: 12, color: '#f7c948',
            }}>
              <Info size={13} />
              Dados disponíveis a partir de <strong style={{ marginLeft: 4 }}>{abcMeta.periodo_real_inicio}</strong>.
            </div>
          </div>
        )}
        {!abcLoading && abcApiData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: theme.colors.muted }}>
            <BarChart2 size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text, marginBottom: 6 }}>
              Nenhum produto com vendas no período
            </div>
            <div style={{ fontSize: 12 }}>Amplie o intervalo de datas ou verifique se há vendas concluídas.</div>
          </div>
        ) : (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: 48 }}>Classe</Th>
                  <Th>Produto</Th>
                  <Th $right>Receita</Th>
                  <Th $right>% Receita</Th>
                  <Th $right>% Acumulado</Th>
                </tr>
              </thead>
              <tbody>
                {abcPagination.paginatedItems.map(p => (
                  <Tr key={p.produtoId}>
                    <Td>
                      <Tag color={ABC_CONFIG[p.classe].color} bg={ABC_CONFIG[p.classe].bg}>
                        {p.classe}
                      </Tag>
                    </Td>
                    <Td>
                      <ProductName>{p.nome}</ProductName>
                      <ProductSku>{p.sku}</ProductSku>
                    </Td>
                    <Td $right style={{ fontWeight: 700 }}>{fmtBRL(p.receita)}</Td>
                    <Td $right>
                      <AbcBar>
                        {(p.percentual ?? 0).toFixed(1)}%
                        <AbcTrack>
                          <AbcFill $pct={Math.min((p.percentual ?? 0) * 3, 100)} $class={p.classe} />
                        </AbcTrack>
                      </AbcBar>
                    </Td>
                    <Td $right>{(p.acumulado ?? 0).toFixed(1)}%</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination {...abcPagination} />
          </TableWrap>
        )}
      </Card>

      {/* Estoque com ruptura */}
      {rupturas.length > 0 && (
        <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '20px 20px 0' }}>
            <SectionTitle>
              Rupturas e Críticos
              <SubLabel>{rupturas.length} produto(s) abaixo do mínimo</SubLabel>
            </SectionTitle>
          </div>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th>Categoria</Th>
                  <Th $right>Estoque atual</Th>
                  <Th $right>Mínimo</Th>
                  <Th $right>Status</Th>
                </tr>
              </thead>
              <tbody>
                {rupturasPagination.paginatedItems.map(p => {
                  const cfg = p.status === 'out'
                    ? { color: '#ff5b6b', bg: 'rgba(255,91,107,.12)', label: 'Zerado' }
                    : { color: '#f7c948', bg: 'rgba(247,201,72,.12)', label: 'Baixo'  }
                  return (
                    <Tr key={p.id}>
                      <Td>
                        <ProductName>{p.nome}</ProductName>
                        <ProductSku>{p.sku}</ProductSku>
                      </Td>
                      <Td style={{ color: theme.colors.muted }}>{p.categoria}</Td>
                      <Td $right style={{ fontWeight: 700, color: cfg.color }}>{p.estoque} un</Td>
                      <Td $right style={{ color: theme.colors.muted }}>{p.minimo} un</Td>
                      <Td $right>
                        <Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag>
                      </Td>
                    </Tr>
                  )
                })}
              </tbody>
            </Table>
            <Pagination {...rupturasPagination} />
          </TableWrap>
        </Card>
      )}
      {deadStock.length > 0 && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <SectionTitle>
              Estoque Parado
              <SubLabel>sem saída registrada há ≥ 30 dias</SubLabel>
            </SectionTitle>
          </div>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th>Categoria</Th>
                  <Th $right>Estoque</Th>
                  <Th $right>Valor imobilizado</Th>
                  <Th $right>Dias parado</Th>
                </tr>
              </thead>
              <tbody>
                {deadStockPagination.paginatedItems.map(p => (
                  <Tr key={p.id}>
                    <Td>
                      <ProductName>{p.nome}</ProductName>
                      <ProductSku>{p.sku}</ProductSku>
                    </Td>
                    <Td style={{ color: theme.colors.muted }}>{p.categoria}</Td>
                    <Td $right>{p.estoque} un</Td>
                    <Td $right style={{ fontWeight: 700 }}>
                      {fmtBRL((p.estoque ?? 0) * (p.custo ?? 0))}
                    </Td>
                    <Td $right>
                      <DaysBadge $days={p.diasParado}>
                        {p.diasParado === 9999 ? 'nunca' : `${p.diasParado}d`}
                      </DaysBadge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <Pagination {...deadStockPagination} />
          </TableWrap>
        </Card>
      )}
    </div>
  )
}
