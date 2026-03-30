import { useState, useEffect, useRef } from 'react'
import { Download, FileText, Printer } from 'lucide-react'
import { csvExport, printReport, getTabExportData } from '../../../utils/exportUtils'
import {
  ExportWrap, ExportTrigger, ExportDropdown, ExportOption,
} from '../RelatoriosStyles'

// Abas sem suporte a CSV (sem dados estruturados para exportar)
const NO_CSV_TABS = ['fiscal']

export function ExportButton({ tab }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleCSV() {
    const data = getTabExportData(tab)
    if (!data) return
    csvExport(data.headers, data.rows, data.filename)
    setOpen(false)
  }

  function handlePrint() {
    setOpen(false)
    // Pequeno delay para fechar o dropdown antes de imprimir
    setTimeout(() => printReport(), 80)
  }

  const canCSV = !NO_CSV_TABS.includes(tab)

  return (
    <ExportWrap ref={wrapRef} data-print-hide>
      <ExportTrigger onClick={() => setOpen(o => !o)} title="Exportar relatório">
        <Download size={14} />
        Exportar
      </ExportTrigger>

      {open && (
        <ExportDropdown>
          {canCSV && (
            <ExportOption onClick={handleCSV}>
              <FileText size={15} />
              Exportar CSV
            </ExportOption>
          )}
          <ExportOption onClick={handlePrint}>
            <Printer size={15} />
            Imprimir / PDF
          </ExportOption>
        </ExportDropdown>
      )}
    </ExportWrap>
  )
}
