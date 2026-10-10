# Login

## O que é
Componente de interface para autenticação de usuários.

## Para que serve
Permite que o usuário insira e-mail e senha para acessar o sistema. Renderiza uma interface com a logo e lida com mensagens de erro, sucesso ou e-mails de redefinição de senha.

## Onde está
`src/components/Login.jsx`

## Do que depende
- `lucide-react` para ícones
- `../services/db` para validar credenciais. Depende diretamente do método `login()` e `resetPassword()` do [[db]].

## Quem depende dele
- [[App]]: Só exibe os dashboards se o estado do usuário for populado após um sucesso no componente de login.

## Como funciona
Possui estados para email, senha e modo de recuperação. Ao submeter o formulário de login, chama `db.login(email, password)`. Se obtiver sucesso, chama a prop `onLoginSuccess(user)`, o que notifica o `App.jsx` para liberar a navegação.

## O que pode quebrar se ele for alterado
- Se a prop `onLoginSuccess` for modificada ou não for chamada, o usuário ficará preso na tela de login mesmo colocando a senha correta.
- O layout de responsividade depende das classes que definem a grade da interface.
