# EmployeeDashboard

## O que é
É a interface onde os funcionários comuns interagem com o sistema, fazem treinamentos e conferem as escalas.

## Para que serve
Permite que o funcionário veja sua escala semanal, responda atividades publicadas pelos seus gestores, veja materiais de estudos (guias) e consulte suas avaliações de desempenho.

## Onde está
`src/components/EmployeeDashboard.jsx`

## Do que depende
- Do [[db]] para resgatar atividades, escalas (schedules) e estatísticas individuais.
- Estado global fornecido pelo `currentUser` a partir do [[App]].

## Quem depende dele
É invocado exclusivamente pelo [[App]] para o papel (role) de 'funcionario'.

## Como funciona
Quando carregado, o componente executa `loadData()` que busca no [[Supabase]] via [[db]] as "atividades designadas" (`activity_assignments`) ligadas ao `user_id` dele, o seu `work_schedules` para a semana, as suas avaliações (`evaluations`) e documentos da unidade. Há abas internas manipuladas pelo estado para separar as exibições.

## O que pode quebrar se ele for alterado
Caso a estrutura de envio de resposta das atividades para a chamada de banco `submitActivity` for alterada localmente sem alterar o lado do servidor, o processo pode travar, deixando a atividade pendente eternamente.
