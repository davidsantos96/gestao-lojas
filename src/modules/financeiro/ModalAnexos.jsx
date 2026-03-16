import { useState, useRef } from 'react'
import { X, Paperclip, Upload, FileText, Image, Trash2, Eye, Download } from 'lucide-react'
import { C } from '../../constants/theme'

const TIPOS_ACEITOS = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 10

function fileIcon(type) {
  if (type.startsWith('image/')) return <Image size={16} color={C.blue} />
  return <FileText size={16} color={C.yellow} />
}

function fmtSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ModalAnexos({ conta, anexos = [], onClose, onAnexar, onRemover }) {
  const inputRef       = useRef()
  const [dragOver, setDragOver] = useState(false)
  const [erro,     setErro]     = useState(null)
  const [preview,  setPreview]  = useState(null)   // { url, type, nome }

  const validar = (file) => {
    if (!TIPOS_ACEITOS.includes(file.type))
      return 'Formato não suportado. Use PDF, JPG ou PNG.'
    if (file.size > MAX_MB * 1024 * 1024)
      return `Arquivo muito grande. Máximo ${MAX_MB} MB.`
    return null
  }

  const processar = (files) => {
    setErro(null)
    Array.from(files).forEach(file => {
      const err = validar(file)
      if (err) { setErro(err); return }
      const url = URL.createObjectURL(file)
      onAnexar?.({ id: Date.now() + Math.random(), nome: file.name, tipo: file.type, tamanho: file.size, url })
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    processar(e.dataTransfer.files)
  }

  const abrirPreview = (anexo) => {
    if (anexo.tipo.startsWith('image/')) {
      setPreview(anexo)
    } else {
      window.open(anexo.url, '_blank')
    }
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 520, position: 'relative', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} color={C.muted} />
          </button>
          <div style={{ fontSize: 11, color: C.blue, fontFamily: 'monospace', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6 }}>Financeiro · Anexos</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>{conta.descricao}</h3>
          <p style={{ fontSize: 12, color: C.muted, marginBottom: 24 }}>Notas fiscais, boletos e documentos relacionados</p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? C.blue : C.border}`,
              borderRadius: 10,
              padding: '22px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(79,143,255,.06)' : C.s2,
              transition: 'all .15s',
              marginBottom: 20,
              flexShrink: 0,
            }}
          >
            <Upload size={22} color={dragOver ? C.blue : C.muted} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: dragOver ? C.blue : C.text, fontWeight: 600 }}>
              {dragOver ? 'Solte o arquivo aqui' : 'Arraste ou clique para anexar'}
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>PDF, JPG, PNG · Máx. {MAX_MB} MB por arquivo</div>
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple hidden onChange={e => processar(e.target.files)} />
          </div>

          {/* Erro */}
          {erro && (
            <div style={{ fontSize: 12, color: C.red, background: 'rgba(255,91,107,.08)', border: `1px solid rgba(255,91,107,.25)`, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
              {erro}
            </div>
          )}

          {/* Lista de anexos */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {anexos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: C.muted, fontSize: 13 }}>
                <Paperclip size={22} color={C.border} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                Nenhum documento anexado ainda
              </div>
            ) : (
              anexos.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: C.s2,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.s3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {fileIcon(a.tipo)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nome}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{fmtSize(a.tamanho)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button title="Visualizar" onClick={() => abrirPreview(a)} style={{ padding: '5px 7px', background: C.s3, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer' }}>
                      <Eye size={13} color={C.blue} />
                    </button>
                    <a href={a.url} download={a.nome} title="Baixar" style={{ padding: '5px 7px', background: C.s3, border: `1px solid ${C.border}`, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                      <Download size={13} color={C.muted2} />
                    </a>
                    <button title="Remover" onClick={() => onRemover?.(a.id)} style={{ padding: '5px 7px', background: C.s3, border: `1px solid rgba(255,91,107,.3)`, borderRadius: 6, cursor: 'pointer' }}>
                      <Trash2 size={13} color={C.red} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 12, color: C.muted }}>{anexos.length} arquivo{anexos.length !== 1 ? 's' : ''} anexado{anexos.length !== 1 ? 's' : ''}</span>
            <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'none', color: C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Preview de imagem */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, cursor: 'zoom-out' }}
        >
          <img src={preview.url} alt={preview.nome} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,.6)', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>
            <X size={16} color="#fff" />
          </button>
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 12, color: C.muted, background: 'rgba(0,0,0,.6)', padding: '4px 12px', borderRadius: 20 }}>
            {preview.nome}
          </div>
        </div>
      )}
    </>
  )
}
