# db (Database Service)

## O que é
A camada de abstração de dados (Service Layer) que conecta a aplicação React ao [[Supabase]].

## Para que serve
Centraliza toda a lógica e as requisições de banco de dados (CRUD). Evita que os componentes do React façam requisições SQL/REST cruas. 

## Onde está
`src/services/db.js`

## Do que depende
- `../supabase`: Configuração de cliente do Supabase e as credenciais importadas do arquivo `.env`.

## Quem depende dele
Praticamente todos os componentes da aplicação, como [[Login]], [[ManagerDashboard]], [[EmployeeDashboard]], [[App]] e [[AdminDashboard]].

## Como funciona
Utiliza a SDK do JavaScript `@supabase/supabase-js`. 
Expõe funções genéricas (como `getAll`, `getById`, `save`, `delete`) que fazem select/insert padrão em tabelas, além de funções complexas específicas (como `getManagerStats`, `login`, `getEmployeeActivities`, `submitActivity`). 
Possui uma função assíncrona `submitActivity` que usa RPC (`supabase.rpc`) para rodar uma stored procedure no banco chamada `submit_activity`.
Também trata cache local via localStorage (`cb_current_user`) para manter o usuário logado entre recarregamentos da aba (apesar do Supabase já possuir a própria gestão de sessão).

## O que pode quebrar se ele for alterado
- Alterar nomes de tabelas ou formatos de payload de saída vai quebrar os Dashboards, que esperam um array de objetos específico. 
- Mudar a forma de manipulação do erro pode engolir exceções, resultando em retornos `undefined` nos Dashboards que quebrariam as renderizações baseadas no `length` dos dados.

## Arquivos relacionados
- [[Supabase]]: O arquivo de inicialização da conexão.
- O arquivo `.env` (que precisa das credenciais ativas).
