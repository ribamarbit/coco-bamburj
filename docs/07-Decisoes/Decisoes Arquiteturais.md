# Decisões Arquiteturais

## O que é
Registro histórico das decisões tecnológicas e de design fundamentais que embasaram a arquitetura do Coco-bambu-teste.

## SPA sem Router Externo
Foi decidido não usar bibliotecas robustas de roteamento (como `react-router-dom`).
**Contexto**: O projeto optou por gerenciar telas (dashboards e abas) via variáveis de estado simples (`currentTab`) diretamente no [[App]]. 
**Consequências**: 
- *Vantagem*: Simplicidade inicial de não configurar contextos de roteamento.
- *Desvantagem*: URLs fixas, o que impossibilita o "Deep Linking" (compartilhar o link de uma aba específica, recarregar a página mantém a aba errada e usar botões de Voltar do navegador quebra a experiência do usuário).

## Monolito Frontend + BaaS (Backendless)
**Contexto**: Optou-se por usar o [[Supabase]] em vez de criar uma API Rest própria (Node/Express, Java, etc.). 
**Consequências**: 
- O código das requisições está totalmente concentrado no frontend (no arquivo [[db]]).
- Exige uso pesado de **RLS** no banco, do contrário qualquer usuário com acesso ao console do navegador poderia forjar chamadas usando o `anon_key` que é público.
- *Funções de regra de negócio* complexas, como computar notas (`submitActivity`), precisaram ser empurradas para o banco de dados (funções RPC) para evitar expor respostas corretas no frontend.

## Chamadas e Fetch Data dentro do `useEffect`
**Contexto**: Os componentes como [[ManagerDashboard]] e [[EmployeeDashboard]] executam o fetch inteiro de dados massivos na sua inicialização com `useEffect`, guardando em estado local extenso (`useState`) e filtrando na própria memória do navegador.
**Consequências**:
- Pode levar a travamentos se a unidade tiver milhares de funcionários ou se houver milhares de avaliações antigas registradas. Paginação não foi implementada de ponta a ponta nesse padrão arquitetural.

## Reatividade vs Async/Await loops
**Contexto**: O projeto encontrou falhas por uso de `forEach` com `await` interno ou por invocar referências diretas de `useState` não instanciadas (Bug conhecido que precisou ser corrigido).
**Consequências**:
O uso de iteradores no banco para notificações (no [[ManagerDashboard]]) foi forçado ao uso de `for...of` ou `Promise.all` para manter sincronia correta com requisições HTTP (Supabase fetch).
