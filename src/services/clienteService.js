import { api } from './api';

export const clienteService = {
  // Retorna todos os clientes com segmentação atualizada
  getAll: async () => {
    const res = await api.get('/clientes');
    const clientes = Array.isArray(res) ? res : (res?.data ?? res?.clientes ?? []);

    const hoje = new Date();
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(hoje.getMonth() - 6);

    return clientes.map(c => {
      let segmento = c.segmento || "Regular";
      
      // Aplicar regra dinâmica caso exista data da última compra e os agregados
      if (c.ultima_compra) {
        const dataUltimaCompra = new Date(c.ultima_compra);
        if (dataUltimaCompra < seisMesesAtras) {
          segmento = "Inativo";
        } else if (c.compras >= 10 || c.gasto_total >= 3000) {
          segmento = "VIP";
        } else if (segmento === "Inativo" && dataUltimaCompra >= seisMesesAtras) {
          segmento = "Regular";
        }
      }

      return { ...c, segmento };
    });
  },

  // Busca um cliente específico
  getById: async (id) => {
    const res = await api.get(`/clientes/${id}`);
    return res;
  },

  // Cria um novo cliente
  create: async (novoCliente) => {
    const res = await api.post('/clientes', novoCliente);
    return res;
  },

  // Atualiza um cliente
  update: async (id, dados) => {
    const res = await api.patch(`/clientes/${id}`, dados);
    return res;
  },

  // Retorna histórico de compras
  getHistory: async (id) => {
    const res = await api.get(`/clientes/${id}/historico`);
    return res;
  },

  // Análise RFM de clientes por período
  // GET /clientes/rfm?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
  // → { data: [{ clienteId, nome, R, F, M, score_r, score_f, score_m, segmento, ultima_compra }], meta }
  getRfm: async ({ inicio, fim } = {}) => {
    const params = {}
    if (inicio) params.inicio = inicio
    if (fim)    params.fim    = fim
    return api.get('/clientes/rfm', params)
  },

  // Busca simples para vinculação (datalist/autocomplete)
  search: async (term) => {
    if (!term) return [];
    const res = await api.get('/clientes');
    const clientes = Array.isArray(res) ? res : (res?.data ?? res?.clientes ?? []);
    return clientes.filter(c => c.nome.toLowerCase().includes(term.toLowerCase())).slice(0, 5);
  }
};
