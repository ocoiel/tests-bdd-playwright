# language: pt
@after @admin @access_permission @url_padrao
Funcionalidade: Jornada Administrativa - Permissão de Acesso

  Contexto: Acessar o site
    Dado que acesso o admin

  @debug
  Cenario: Cadastrar - Permissão de Acesso para Gestão de Contas
    Quando eu estiver logado com email 'ifc.bot.boleto@gmail.com' e senha 'Teste@123'
    E clicar na aba Usuários
    E buscar pelo Usuário 'Automação Infracommerce'
    E clicar em Detalhes
    E clicar em Editar usuário
    E selecionar o perfil Gestão de Contas
    E adicionar o Acesso
    E salvar as alterações de acesso
    E clicar no menu Contas
    E clicar na aba Gestão de conta
    Entao a Gestão de Contas permite edição
  # Cenario: Excluir - Permissão de Acesso para Gestão de Contas
  #   Quando eu estiver logado com email 'ifc.bot.boleto@gmail.com' e senha 'Teste@123'
  #   E clicar no menu Configurações
  #   E clicar na aba Gestão de Acesso
  #   E clicar na aba Usuários
  #   E buscar pelo Usuário 'Automação Infracommerce'
  #   E clicar em Detalhes
  #   E clicar em Editar usuário
  #   E remover o Acesso ao perfil Gestão de Contas
  #   E salvar as alterações de acesso
  #   E clicar no menu Contas
  #   E clicar na aba Gestão de conta
  #   Entao a Gestão de Contas não permite edição
