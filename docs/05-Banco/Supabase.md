# Supabase (Banco de Dados)

## O que é
A camada de persistência e backend do projeto. O Supabase é utilizado como BaaS (Backend-as-a-Service).

## Para que serve
Armazena todos os registros do sistema em PostgreSQL, lida com criação de usuários, senhas e autenticação (Auth), e provê a API (REST/GraphQL) utilizada pelo cliente React.

## Onde está configurado
`src/supabase.js`
`src/services/db.js`
E fisicamente instanciado nos servidores em nuvem do Supabase (acessado pelas credenciais no arquivo `.env`).

## Tabelas e Relacionamentos Identificados
Conforme lido no serviço [[db]], as tabelas existentes são:
- `users`: (id, email, role, unit_id, status, manager_id)
- `units`: (id, nome, etc)
- `activities`: Atividades/Provas (id, manager_id, unit_id, status, title, theme, deadline)
- `questions`: Questões das atividades (id, activity_id, question_index)
- `activity_assignments`: Relação Muitos-para-Muitos entre `users` e `activities`. Determina o progresso de um funcionário na atividade. (id, activity_id, user_id, status, score, max_score, completion_date)
- `answers`: Registra a opção escolhida pelo funcionário para cada `question_id`.
- `warmups`: Rascunhos de reuniões ou "esquentas". (id, manager_id, unit_id, status)
- `evaluations`: Feedback/Avaliação de performance. (id, manager_id, employee_id)
- `work_schedules`: Escala de horários. (id, user_id, date, shift, hours, off_day)
- `documents`: Documentos base ou guias da operação.
- `notifications`: Sistema de alertas no app (id, user_id, message, is_read).

## Funções (RPC) Identificadas
- `submit_activity`: Processa as respostas (`answers`) de um funcionário para as perguntas de uma atividade num contexto seguro direto no SQL, ao invés de depender de validações client-side que poderiam ser fraudadas.

## Como funciona
A conexão usa o `createClient` com a URL e `ANON_KEY` definida no `.env`. Toda a segurança do banco provavelmente recai sobre **Row Level Security (RLS)**, ou seja, regras no PostgreSQL que impedem o `anon_key` de ler ou escrever registros onde o `user_id` não seja igual ao ID autenticado (token JWT da requisição).

## Integrações
- Depende da própria nuvem do Supabase, requer internet. Sem `.env` configurado, a aplicação frontend simplesmente quebra ao tentar efetuar as chamadas de API.
