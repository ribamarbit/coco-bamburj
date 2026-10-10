# MonthlyScheduleMatrix

## O que é
Componente focado em visualização de matriz (linhas e colunas) da escala de trabalho dos funcionários.

## Para que serve
Visualizar em formato de grade dias x funcionários. Ele renderiza a tabela de escalas semanais ou mensais para a visualização, indicando horas e turnos de forma aglutinada.

## Onde está
`src/components/MonthlyScheduleMatrix.jsx`

## Do que depende
- É injetado com props externas (provavelmente `schedules`, `teamUsers`, e callbacks). O componente não faz chamadas de banco de dados diretamente; sua responsabilidade é visual.

## Quem depende dele
- O [[ManagerDashboard]] para exibir e permitir edição.
- O [[AdminDashboard]] possivelmente pode visualizá-lo caso queira aprofundar na unidade (embora não listado explicitamente).

## Como funciona
Pega a estrutura complexa do banco onde cada registro de `work_schedules` (id, user_id, date, shift) é transformado em uma matriz. Ele cruza a lista de `teamUsers` (Linhas) com um range de `dates` (Colunas), colorindo a célula de acordo com `off_day` ou turno.

## O que pode quebrar se for alterado
O cruzamento de chaves usando formatação de datas (ex: `YYYY-MM-DD` vs `DD/MM/YYYY`) pode quebrar facilmente se a prop passada por fora pelo Manager não tiver um alinhamento perfeito.
