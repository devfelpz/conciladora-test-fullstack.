### Funcionalidades Implementadas
- Edição de clientes: Nome, Telefone, Endereço, Status de Mensalista e Valor da Mensalidade.
- Validações:
  - Nome, Telefone e Endereço obrigatórios.
  - Telefone deve conter apenas números.
  - Valor da mensalidade deve ser numérico e positivo, somente se o usuário for mensalista.
- Mensagens de erro claras exibidas no formulário para campos inválidos.
- Garantia de unicidade da combinação Nome + Telefone no backend.

### Decisões Técnicas
- **Frontend**
  - React Hook Form para gerenciamento de formulários e validação.
  - Switch customizado para alterar status de mensalista.
  - Exibição de mensagens de erro do backend diretamente nos campos do formulário.
- **Backend**
  - Validação de duplicidade usando `AnyAsync` antes de salvar alterações.
  - Retorno de mensagens de erro específicas para facilitar UX.
- **Integração**
  - Atualização da lista de clientes após edição (`invalidateQueries`).

