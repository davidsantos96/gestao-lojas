import { useState, useEffect } from 'react'
import { clienteService } from '../../services/clienteService'
import * as S from './ClientesStyles'
import { CadastroCliente } from './CadastroCliente'
import { FichaCliente } from './FichaCliente'
import { KPI } from '../../components/ui/KPI'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { Users, Star, UserX, Search, PlusCircle } from 'lucide-react'
import { fmtBRL } from '../../utils/format'

export function Clientes() {
  const [activeTab, setActiveTab] = useState('lista')
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      const data = await clienteService.getAll()
      setClientes(data)
      setLoading(false)
    }
    cargar()
  }, [])

  const filteredClientes = clientes.filter(c => {
    const matchesSearch = c.nome.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || c.segmento.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const pagination = usePagination(filteredClientes)

  const kpis = {
    total: clientes.length,
    vips: clientes.filter(c => c.segmento === 'VIP').length,
    inativos: clientes.filter(c => c.segmento === 'Inativo').length
  }

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente)
    setActiveTab('ficha')
  }

  if (activeTab === 'cadastro') {
    return (
      <CadastroCliente 
        onClose={() => setActiveTab('lista')} 
        onSave={async () => {
          const data = await clienteService.getAll()
          setClientes(data)
          setActiveTab('lista')
        }} 
      />
    )
  }

  if (activeTab === 'ficha' && selectedCliente) {
    return (
      <FichaCliente 
        clienteId={selectedCliente.id} 
        onClose={() => {
          setSelectedCliente(null)
          setActiveTab('lista')
        }} 
      />
    )
  }

  return (
    <S.Container>
      {/* KPIs */}
      <S.KPIHeader>
        <KPI 
          label="Total de Clientes" 
          value={kpis.total} 
          icon={Users} 
        />
        <KPI 
          label="Clientes VIP" 
          value={kpis.vips} 
          color="#FFD700" 
          icon={Star} 
        />
        <KPI 
          label="Inativos" 
          value={kpis.inativos} 
          color="#FF4B4B" 
          icon={UserX} 
        />
      </S.KPIHeader>

      {/* Busca e Filtros */}
      <S.SearchCard>
        <Search size={16} color="var(--muted)" />
        <S.SearchInput 
          type="text" 
          placeholder="Buscar por nome ou e-mail..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <S.FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Filtrar por Segmento</option>
          <option value="vip">VIP</option>
          <option value="regular">Regular</option>
          <option value="inativo">Inativos</option>
        </S.FilterSelect>
        <S.PrimaryButton onClick={() => setActiveTab('cadastro')}>
          <PlusCircle size={15} />
          Novo Cliente
        </S.PrimaryButton>
      </S.SearchCard>

      {/* Tabela de Lista */}
      <S.TableWrap>
        {loading ? (
          <S.EmptyState>Carregando clientes...</S.EmptyState>
        ) : filteredClientes.length > 0 ? (
          <S.Table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Segmento</th>
                <th>Última Compra</th>
                <th>Gasto Total</th>
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedItems.map(cliente => (
                <tr key={cliente.id} onClick={() => handleEdit(cliente)}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <S.SegmentBadge type={cliente.segmento}>
                      {cliente.segmento}
                    </S.SegmentBadge>
                  </td>
                  <td>
                    <S.DateText>
                      {cliente.ultima_compra ? new Date(cliente.ultima_compra).toLocaleDateString() : 'Nunca'}
                    </S.DateText>
                  </td>
                  <td>
                    <S.ValueText>
                      {fmtBRL(cliente.gasto_total)}
                    </S.ValueText>
                  </td>
                </tr>
              ))}
            </tbody>
          </S.Table>
          <Pagination {...pagination} />
        ) : (
          <S.EmptyState>Nenhum cliente encontrado.</S.EmptyState>
        )}
      </S.TableWrap>
    </S.Container>
  )
}
