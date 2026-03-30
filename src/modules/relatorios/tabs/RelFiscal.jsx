import { FileText } from 'lucide-react'
import { EmptyState } from '../../../components/ui/EmptyState'

const FUNCIONALIDADES = [
  'Emissão e consulta de NF-e',
  'Geração do SPED Fiscal',
  'Apuração de ICMS, PIS e COFINS',
  'Certificado digital A1 / A3',
  'Integração com contabilidade',
]

export function RelFiscal() {
  return (
    <EmptyState
      icon={FileText}
      title="Módulo Fiscal — em breve"
      description={
        <div style={{ textAlign: 'left', marginTop: 8 }}>
          <div style={{ marginBottom: 6, textAlign: 'center' }}>Funcionalidades planejadas:</div>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {FUNCIONALIDADES.map(f => (
              <li key={f} style={{ fontSize: 12, opacity: 0.7 }}>· {f}</li>
            ))}
          </ul>
        </div>
      }
    />
  )
}
