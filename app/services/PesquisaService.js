class PesquisaService {
    // Função para determinar a funcionalidade com base no termo de pesquisa
    static determinarFuncionalidade(query) {
      const termos = query.toLowerCase().trim(); // Normaliza o termo de pesquisa
  
      // Mapeamento de termos para rotas específicas
      if (termos.includes('detento') || termos.includes('preso')) {
        return { redirect: '/detentos/lista', mensagem: 'Redirecionando para a lista de detentos...' };
      } else if (termos.includes('cela') || termos.includes('pavilhão')) {
        return { redirect: '/celas/lista', mensagem: 'Redirecionando para a lista de celas...' };
      } else if (termos.includes('visita') || termos.includes('advogado')) {
        return { redirect: '/visitasAdvogado/lista', mensagem: 'Redirecionando para a lista de visitas de advogados...' };
      } else if (termos.includes('relatório') || termos.includes('ocupação')) {
        return { redirect: '/relatorios/ocupacao', mensagem: 'Redirecionando para o relatório de ocupação...' };
      } else {
        return { redirect: null, mensagem: 'Nenhuma funcionalidade encontrada para este termo.' };
      }
    }
  }
  
  module.exports = PesquisaService;