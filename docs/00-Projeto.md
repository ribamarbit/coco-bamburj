# Coco Bambu — Mapa do Projeto

## Visão geral
O **Coco-bambu-teste** é uma aplicação web focada em treinamento, avaliações e gestão de equipe (provavelmente para uma rede de restaurantes). Ele permite o acesso por três perfis: Administradores, Gestores e Funcionários, centralizando atividades, "esquentas" (warmups), avaliações e a escala de trabalho.

## Stack
- **Frontend**: React (Vite), JavaScript, CSS puro
- **Ícones**: Lucide React
- **Backend / Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth

## Arquitetura
A arquitetura é um Monolito Frontend (SPA) consumindo um BaaS (Backend as a Service) - o Supabase.
Veja mais em: [[Arquitetura Geral]]

## Módulos
Não há módulos separados estruturalmente (como pastas `modules/`), mas a lógica se divide nos três perfis de acesso:
- **Admin**: Gerenciamento global e KPIs.
- **Manager**: Gestão de atividades, esquentas e escalas da equipe.
- **Employee**: Visualização de escala e execução de atividades.

## Componentes
- [[App]] (Ponto de entrada)
- [[Login]] (Autenticação)
- [[AdminDashboard]] (Painel de Administrador)
- [[ManagerDashboard]] (Painel de Gestor)
- [[EmployeeDashboard]] (Painel de Funcionário)
- [[Sidebar]] (Navegação)
- [[MonthlyScheduleMatrix]] (Matriz de Escala)

## Serviços
- [[db]] (Serviço central de comunicação com o Supabase)

## Banco de Dados
- [[Supabase]] (Tabelas e Autenticação)

## Fluxos
- [[Fluxo de Autenticacao]]
- [[Fluxo de Atividade]]

## Decisões e Arquitetura
- [[Decisoes Arquiteturais]]

## Pontos críticos
- A segurança depende exclusivamente das RLS (Row Level Security) configuradas no Supabase. O Frontend confia que o token retornado é válido.
- O gerenciamento de estado é feito majoritariamente de forma local (via `useState` e `useEffect`) dentro de componentes grandes (Dashboards), o que pode dificultar testes.
- As consultas ao banco e os `joins` são manuais (ex: no `db.js`), sem uso de uma ferramenta como React Query ou Redux.

## Como começar a entender o projeto
Comece pelo [[App]], que gerencia a troca de abas e verifica a autenticação do usuário, em seguida verifique o [[db]], que dita como o sistema busca e envia dados.

## Mapa de dependências
O fluxo de chamadas principal:
`index.html` → `main.jsx` → `App.jsx` → (Componentes de Dashboard) → `db.js` → `supabase.js` → (Nuvem)
