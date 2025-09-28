### TASK 1 - COMPLETAR A TELA DE CLIENTE

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

### TASK 3 - MELHORAR UPLOAD CSV

## Funcionalidade Implementada
- Melhoria do relatório de erros no upload de CSV:
  - Cada linha que apresentar erro retorna:
    - Número da linha no CSV
    - Tipo do erro (`Placa duplicada`, `Placa inválida`, etc.)
    - Dados completos da linha: placa, modelo, ano, cliente, mensalista e valorMensalidade
  - Erros em uma linha **não interrompem** o processamento das demais.
- `mensalista` agora interpreta corretamente `"Sim"`/`"Não"` ou `"true"`/`"false"`.
- `valorMensalidade` é parseado corretamente, mesmo quando vem com aspas ou ponto decimal.

---

## Decisões Técnicas
1. **Estrutura de Dados**
   - Uso de DTOs `CSVErrorDto` e `CSVErrorExplain` para organizar os erros.
   - Permite fácil integração com frontend e visualização clara dos erros.

2. **Parsing e Validação**
   - Conversão robusta de valores:
     - `mensalista`: switch normalizando valores de texto e booleanos.
     - `valorMensalidade`: `decimal.TryParse` com `InvariantCulture` e remoção de aspas.


3. **Persistência**
   - Cliente é criado caso não exista, garantindo consistência do banco.
   - Veículos são adicionados apenas se não houver duplicidade.

4. **Experiência do Usuário**
   - JSON retornado detalha erros e dados da linha.
   - Permite identificar rapidamente problemas sem interromper a importação do CSV.

---

## Exemplo de Retorno JSON

```json
{
  "processados": 10,
  "inseridos": 0,
  "error": [
    {
      "linha": 1,
      "tipoErro": "Placa duplicada",
      "placa": "ABC1234",
      "modelo": "Ford Ka",
      "ano": 2018,
      "clienteId": 1,
      "clienteNome": "Felipe Araujo",
      "clienteTelefone": "11999999999",
      "clienteEndereco": "Rua A",
      "mensalista": true,
      "valorMensalidade": 350.00
    }
  ]
}