import { Calendar } from 'lucide-react'
import {
  FilterBar, FilterLabel, PresetBtn, Divider, DateInput,
} from '../RelatoriosStyles'

// Presets disponíveis — cada um calcula {inicio, fim} a partir de hoje
const PRESETS = [
  { key: '7d',  label: '7 dias'   },
  { key: '30d', label: '30 dias'  },
  { key: '90d', label: '90 dias'  },
  { key: '12m', label: '12 meses' },
]

function toISO(date) {
  return date.toISOString().split('T')[0]
}

function resolvePreset(key) {
  const fim = new Date()
  const inicio = new Date()

  switch (key) {
    case '7d':  inicio.setDate(fim.getDate() - 7);       break
    case '30d': inicio.setDate(fim.getDate() - 30);      break
    case '90d': inicio.setDate(fim.getDate() - 90);      break
    case '12m': inicio.setFullYear(fim.getFullYear() - 1); break
    default:    inicio.setDate(fim.getDate() - 30)
  }

  return { inicio: toISO(inicio), fim: toISO(fim) }
}

/**
 * PeriodFilter
 *
 * Props:
 *  period  { preset: string, inicio: string (ISO), fim: string (ISO) }
 *  onChange (newPeriod) => void
 */
export function PeriodFilter({ period, onChange }) {
  function handlePreset(key) {
    onChange({ preset: key, ...resolvePreset(key) })
  }

  function handleDate(field, value) {
    onChange({ ...period, preset: 'custom', [field]: value })
  }

  return (
    <FilterBar data-print-hide>
      <Calendar size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
      <FilterLabel>Período</FilterLabel>

      {PRESETS.map(({ key, label }) => (
        <PresetBtn
          key={key}
          $active={period.preset === key}
          onClick={() => handlePreset(key)}
        >
          {label}
        </PresetBtn>
      ))}

      <Divider />

      <DateInput
        type="date"
        value={period.inicio}
        max={period.fim}
        onChange={e => handleDate('inicio', e.target.value)}
        title="Data inicial"
      />
      <span style={{ fontSize: 11, opacity: 0.4 }}>–</span>
      <DateInput
        type="date"
        value={period.fim}
        min={period.inicio}
        onChange={e => handleDate('fim', e.target.value)}
        title="Data final"
      />
    </FilterBar>
  )
}

// Utilitário exportado para inicializar o estado padrão (30d)
export function defaultPeriod() {
  return { preset: '30d', ...resolvePreset('30d') }
}
