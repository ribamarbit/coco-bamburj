# Sidebar

## O que é
Componente do menu de navegação esquerdo (Sidebar).

## Para que serve
Oferecer o controle de troca da aba ativa (`currentTab`) da aplicação. Apresenta links, ícones e ações (como Logout), ajustados de forma dinâmica pelo tipo de usuário.

## Onde está
`src/components/Sidebar.jsx`

## Do que depende
- `lucide-react` para uso massivo de ícones no menu.
- Props: `currentUser`, `currentTab`, `setCurrentTab`, `onLogout`.

## Quem depende dele
- É montado globalmente pelo [[App]] em volta dos Dashboards principais.

## Como funciona
Baseado na role do `currentUser` (ex: `gestor`, `admin`, `funcionario`), ele renderiza listas de botões diferentes. Clicar em um botão apenas altera a string injetada `setCurrentTab('aba')`, fazendo o [[App]] ou o Dashboard interno reagir trocando o conteúdo visível na tela central.

## O que pode quebrar se for alterado
Caso o `setCurrentTab` dispare strings não esperadas pelos controladores de visualização internos (ex: enviar `atividades-ativas` quando o Manager espera `atividades`), o componente interno exibirá uma tela branca ou cairá no fallback padrão (`dashboard`).
