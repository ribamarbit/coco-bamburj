# ManagerDashboard

## O que é
É o painel principal de acesso dos usuários com perfil "gestor".

## Para que serve
Permite que gestores gerenciem sua unidade específica. Isso inclui: listar sua equipe, atribuir atividades ("Esquentas"), monitorar o desempenho, fazer avaliações e organizar a escala de trabalho semanal.

## Onde está
`src/components/ManagerDashboard.jsx`

## Do que depende
- [[MonthlyScheduleMatrix]]: Componente interno para visualizar e editar escalas se necessário (se importado).
- [[db]]: Usa vários métodos para buscar os funcionários daquela unidade, suas avaliações, atividades criadas, etc.
- Estado global fornecido pelo `currentUser` (injetado via props pelo [[App]]).

## Quem depende dele
- [[App]]: Ele é instanciado em `App.jsx` caso o usuário ativo tenha o papel `gestor`.

## Como funciona
Quando montado, usa `useEffect` para chamar a função `loadData()`, que busca os dados da unidade via banco (usando o `unit_id` do gestor). Apresenta um layout com várias "abas" internas disfarçadas (usando estados) ou rola para diferentes seções baseadas no estado `currentTab` e interações na UI.
Ele permite que o gestor elabore rascunhos de atividades, use IA (simulada) para criar perguntas para a equipe e envie (atribua) o teste para todos da sua unidade.

## O que pode quebrar se ele for alterado
- A lógica de filtros por unidade (`u.unit_id === currentUser.unit_id`) é frágil e feita no cliente. Se essa checagem sumir, o gestor pode acabar vendo e editando dados de outras unidades.
- Possui muito estado local extenso (schedules, atividades, perguntas). Alterar o fluxo de salvamento e envio pode quebrar o link relacional entre atividade e questões.

## Arquivos relacionados
- [[EmployeeDashboard]]: Funcionários dependem que o gestor publique atividades para que as vejam lá.
- [[AdminDashboard]]: Os administradores conseguem enxergar a soma das atividades publicadas.
