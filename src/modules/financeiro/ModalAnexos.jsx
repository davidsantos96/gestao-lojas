import { useState, useRef, useContext } from 'react'
import { X, Paperclip, Upload, FileText, Image, Trash2, Eye, Download } from 'lucide-react'
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  Overlay, ModalContainer, CloseBtn, ModalModule, ModalTitle, ModalDesc, ErrorBox,
  DropZone, DropTitle, DropSub, FilesList, EmptyFiles, FileItem, FileIconWrap,
  FileInfo, FileName, FileSize, FileActions, FileBtn, FileLink, ModalAnexosFooter,
  FooterCount, FooterBtn, PreviewImg, PreviewClose, PreviewLabel
} from './ModaisFinanceiroStyles'

const TIPOS_ACEITOS = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 10

function fileIcon(type, colors) {
  if (type.startsWith('image/')) return <Image size={16} color={colors.blue} />
  return <FileText size={16} color={colors.yellow} />
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
  
  const { theme } = useContext(ThemeContext)

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
      <Overlay $dark>
        <ModalContainer $width="520px" $maxHeight="85vh">

          {/* Header */}
          <CloseBtn onClick={onClose}>
            <X size={18} color={theme.colors.muted} />
          </CloseBtn>
          <ModalModule $mb="6px">Financeiro · Anexos</ModalModule>
          <ModalTitle $size="17px" $mb="4px">{conta.descricao}</ModalTitle>
          <ModalDesc>Notas fiscais, boletos e documentos relacionados</ModalDesc>

          {/* Drop zone */}
          <DropZone
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            $active={dragOver}
          >
            <Upload size={22} color={dragOver ? theme.colors.blue : theme.colors.muted} style={{ marginBottom: 8 }} />
            <DropTitle $active={dragOver}>
              {dragOver ? 'Solte o arquivo aqui' : 'Arraste ou clique para anexar'}
            </DropTitle>
            <DropSub>PDF, JPG, PNG · Máx. {MAX_MB} MB por arquivo</DropSub>
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple hidden onChange={e => processar(e.target.files)} />
          </DropZone>

          {/* Erro */}
          {erro && <ErrorBox $mb>{erro}</ErrorBox>}

          {/* Lista de anexos */}
          <FilesList>
            {anexos.length === 0 ? (
              <EmptyFiles>
                <Paperclip size={22} color={theme.colors.border} />
                Nenhum documento anexado ainda
              </EmptyFiles>
            ) : (
              anexos.map(a => (
                <FileItem key={a.id}>
                  <FileIconWrap>
                    {fileIcon(a.tipo, theme.colors)}
                  </FileIconWrap>
                  <FileInfo>
                    <FileName>{a.nome}</FileName>
                    <FileSize>{fmtSize(a.tamanho)}</FileSize>
                  </FileInfo>
                  <FileActions>
                    <FileBtn title="Visualizar" onClick={() => abrirPreview(a)}>
                      <Eye size={13} color={theme.colors.blue} />
                    </FileBtn>
                    <FileLink href={a.url} download={a.nome} title="Baixar">
                      <Download size={13} color={theme.colors.muted2} />
                    </FileLink>
                    <FileBtn title="Remover" onClick={() => onRemover?.(a.id)} $danger>
                      <Trash2 size={13} color={theme.colors.red} />
                    </FileBtn>
                  </FileActions>
                </FileItem>
              ))
            )}
          </FilesList>

          {/* Footer */}
          <ModalAnexosFooter>
            <FooterCount>{anexos.length} arquivo{anexos.length !== 1 ? 's' : ''} anexado{anexos.length !== 1 ? 's' : ''}</FooterCount>
            <FooterBtn onClick={onClose}>
              Fechar
            </FooterBtn>
          </ModalAnexosFooter>
        </ModalContainer>
      </Overlay>

      {/* Preview de imagem */}
      {preview && (
        <Overlay $darker $zIndex={120} $zoomOut onClick={() => setPreview(null)}>
          <PreviewImg src={preview.url} alt={preview.nome} onClick={e => e.stopPropagation()} />
          <PreviewClose onClick={() => setPreview(null)}>
            <X size={16} color="#fff" />
          </PreviewClose>
          <PreviewLabel>
            {preview.nome}
          </PreviewLabel>
        </Overlay>
      )}
    </>
  )
}

