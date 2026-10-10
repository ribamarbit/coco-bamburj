# Fluxo de Autenticação

## O que é
Passo-a-passo técnico documentando o ciclo de vida da verificação de identidade do sistema.

## O Fluxo

Usuário
↓ (Acessa o site sem sessão armazenada localmente)
Página / Interface (Renderiza o [[App]])
↓ (Verifica `db.getCurrentUser()`)
Componente [[Login]]
↓ (Usuário digita email/senha e envia formulário)
Service [[db]] (`db.login(email, password)`)
↓ (Faz requisição assíncrona ao client SDK)
API do [[Supabase]] (`supabase.auth.signInWithPassword()`)
↓ (Retorna JWT token de sucesso)
Service [[db]]
↓ (Faz segunda consulta no Supabase para pegar a `role` e a `unit_id` do perfil na tabela `users`)
API do [[Supabase]] (`select * from users where id = {auth_id}`)
↓
Service [[db]]
↓ (Valida se o status da conta é "active" e salva em localStorage)
Componente [[Login]] (Invoca a prop callback)
↓ 
App (Muda o estado `currentUser` e encerra a renderização do Login)
↓ 
Interface (Renderiza o Dashboard baseado no papel e chama notificações).

## Pontos Críticos e Falhas
- **Inconsistência de Estado**: Se a sessão JWT do Supabase expirar na nuvem (algo comum em SPAs abertas por dias), o localStorage pode ainda conter o `cb_current_user`. O frontend tentará usar o serviço de banco com um Token expirado, gerando recusas 401 ou 403 e exigindo que o usuário limpe o cache manualmente se o código não tiver tratamento para refresh token ativo ou captura global de erros de token (Auth Listener).
