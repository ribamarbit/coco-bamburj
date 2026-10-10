# AdminDashboard

## O que é
É o painel gerencial de alto nível acessível aos perfis "admin".

## Para que serve
Visualizar estatísticas agregadas de toda a rede de unidades, verificar a saúde geral das filiais, criar unidades novas e administrar as contas globais de gestores.

## Onde está
`src/components/AdminDashboard.jsx`

## Do que depende
- Diversas chamadas aos métodos de estatística global no [[db]], como `getAdminStats()`.
- O papel (role) do usuário injetado pelo [[App]].

## Quem depende dele
- É montado exclusivamente pelo [[App]] quando `currentUser.role === 'admin'`.

## Como funciona
Reúne dados de todos os usuários, independentemente de `unit_id`. Gera métricas, gráficos e permite controle totalitário da plataforma. Assim como o [[ManagerDashboard]], confia no estado local em chamadas massivas ao banco de dados no momento em que é carregado, o que sugere um "dashboard pesado" se houver milhares de registros, pois falta paginação.

## O que pode quebrar se ele for alterado
Estruturar a resposta do Supabase de forma equivocada sem lidar com dados não encontrados (ex: arrays vazios) pode quebrar as iterações e funções matemáticas da Dashboard (ex: cálculos de média ou filtragem por `undefined`).
