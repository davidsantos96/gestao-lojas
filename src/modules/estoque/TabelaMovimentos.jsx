import { C } from '../../constants/theme'
import { Card } from '../../components/ui/Card'
import { Tag } from '../../components/ui/Tag'

const TIPO_CONFIG = {
  entrada: { label: 'Entrada', color: '#00d9a8', bg: 'rgba(0,217,168,.10)' },
  saida:   { label: 'Saída',   color: '#ff5b6b', bg: 'rgba(255,91,107,.10)' },
  ajuste:  { label: 'Ajuste',  color: '#f7c948', bg: 'rgba(247,201,72,.10)' },
}

export function TabelaMovimentos({ movimentos }) {
  return (
    <Card style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {['Data', 'Produto', 'Tipo', 'Qtd', 'Responsável', 'Origem'].map((h, i) => (
              <th key={i} style={{
                padding: '12px 16px', textAlign: 'left', fontSize: 11,
                color: C.muted, fontFamily: 'monospace', letterSpacing: 1.5,
                textTransform: 'uppercase', fontWeight: 500,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {movimentos.map((m, i) => {
            const cfg = TIPO_CONFIG[m.tipo]
            return (
              <tr key={m.id} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>{m.data}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: C.text }}>{m.produto}</td>
                <td style={{ padding: '13px 16px' }}><Tag color={cfg.color} bg={cfg.bg}>{cfg.label}</Tag></td>
                <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 700, color: cfg.color }}>
                  {m.tipo === 'entrada' ? '+' : ''}{m.qtd}
                </td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted2 }}>{m.responsavel}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: C.muted }}>{m.origem}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
