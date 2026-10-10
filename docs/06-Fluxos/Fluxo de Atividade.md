# Fluxo de Atividade (Provas e Treinamentos)

## O que é
Processo ponta a ponta detalhando como um gestor elabora uma avaliação de 10 perguntas e como o funcionário responde e pontua.

## O Fluxo

### Passo 1: Criação
Usuário (Gestor)
↓ (Acessa a aba de criar atividade no [[ManagerDashboard]])
Componente (Preenche dados do rascunho. Possivelmente gera as 10 perguntas pela IA simulada ou importa).
↓ (Clica em Publicar)
Service [[db]]
↓ (Salva registro principal na tabela `activities`, depois salva as questões relacionadas em `questions`, e itera criando registros 'pending' em `activity_assignments` para toda a equipe da unidade)
API do [[Supabase]]
↓ (Também cria registros na tabela `notifications` alertando a equipe)
Interface (Exibe toast de sucesso).

### Passo 2: Resolução
Usuário (Funcionário)
↓ (Vê notificação ou aba de pendentes no [[EmployeeDashboard]])
Componente (Clica em responder prova)
↓ (Navega pelas 10 questões armazenadas no estado React)
Componente (Ao finalizar todas as questões, submete as respostas)
↓
Service [[db]] (`submitActivity`)
↓ (Manda o payload pro banco via `supabase.rpc`)
Banco de Dados do [[Supabase]] (A função PL/pgSQL `submit_activity` do servidor compara as respostas escolhidas contra a coluna `correct_option` secreta, calcula o somatório, atualiza o status de `activity_assignments` para `completed` e grava o score real)
↓
Interface (Exibe nota da avaliação para o funcionário, desbloqueando a visualização dos seus acertos/erros via componente).

## Decisões envolvidas
O uso da função `rpc` no banco (SQL server-side) foi uma escolha arquitetural detalhada em [[Decisoes Arquiteturais]] para impedir fraudes, onde um funcionário lendo a aba 'Network' do navegador poderia descobrir a opção correta antes de enviar o formulário.
