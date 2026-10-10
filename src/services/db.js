import { supabase } from '../supabase';

class SupabaseService {
  
  // --- AUTH ---
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { success: false, message: 'E-mail ou senha inválidos.' };
    }
    
    // Buscar o perfil do usuário
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError || !userProfile) {
       return { success: false, message: 'Erro ao carregar perfil.' };
    }
    
    if (userProfile.status !== 'active') {
      await supabase.auth.signOut();
      return { success: false, message: 'Usuário inativo. Contate o administrador.' };
    }
    
    // Apenas guardamos no localstorage pra facilitar o state inicial do React, 
    // mas a sessão real já está no supabase
    localStorage.setItem('cb_current_user', JSON.stringify(userProfile));
    
    return { success: true, user: userProfile };
  }

  async logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('cb_current_user');
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('cb_current_user'));
    } catch (e) {
      return null;
    }
  }

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, message: 'Erro ao enviar e-mail de recuperação.' };
    }
    return { success: true, message: `Um link de recuperação foi enviado para ${email}.` };
  }

  // --- GENERIC CRUD HELPERS ---
  async getTable(table) { return this.getAll(table); }

  async getAll(table) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Erro ao buscar ${table}:`, error);
      return [];
    }
    return data;
  }

  async getById(table, id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) {
      console.error(`Erro ao buscar ${table} id ${id}:`, error);
      return null;
    }
    return data;
  }

  async save(table, item) {
    // Se tiver ID, atualiza (upsert baseia-se em unique id), senão insere
    const { data, error } = await supabase.from(table).upsert(item).select().single();
    if (error) {
      console.error(`Erro ao salvar em ${table}:`, error);
      throw error;
    }
    return data;
  }

  async saveTable(table, items) {
    const { error } = await supabase.from(table).upsert(items);
    if (error) {
      console.error(`Erro ao salvar tabela ${table}:`, error);
      return false;
    }
    return true;
  }

  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Erro ao deletar de ${table}:`, error);
      return false;
    }
    return true;
  }

  // --- CUSTOM COMPLEX QUERIES & RELATIONSHIPS ---

  async getEmployeeActivities(userId) {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        activity_assignments (
          id, status, score, max_score, completion_date, user_id
        )
      `);
      
    if (error) return [];
    
    // Filtramos no client side os assignments específicos do usuário
    return data.map(act => {
      const asg = act.activity_assignments?.find(a => a.user_id === userId);
      return {
        ...act,
        assignment_id: asg ? asg.id : null,
        status_assignment: asg ? asg.status : 'pending',
        score: asg ? asg.score : null,
        max_score: asg ? asg.max_score : 10,
        completion_date: asg ? asg.completion_date : null
      };
    });
  }

  async submitActivity(userId, activityId, answersList) {
    // Agora usamos a função RPC (stored procedure) que foi criada no SQL
    const { data, error } = await supabase.rpc('submit_activity', {
      p_activity_id: activityId,
      p_answers: answersList
    });
    
    if (error) {
      console.error('Erro ao enviar atividade:', error);
      return { success: false, message: error.message };
    }
    
    return { 
      success: true, 
      assignment: { id: data.assignment_id }, 
      score: data.score, 
      total: data.total 
    };
  }

  async getAssignmentDetails(assignmentId) {
    // Buscar assignment
    const { data: asg } = await supabase.from('activity_assignments').select('*').eq('id', assignmentId).single();
    if (!asg) return null;
    
    // Buscar activity
    const { data: activity } = await supabase.from('activities').select('*').eq('id', asg.activity_id).single();
    
    // Buscar questões
    const { data: questions } = await supabase.from('questions').select('*').eq('activity_id', asg.activity_id).order('question_index');
    
    // Buscar respostas
    const { data: answers } = await supabase.from('answers').select('*').eq('assignment_id', assignmentId);

    const questionsWithAnswers = questions?.map(q => {
      const ans = answers?.find(a => a.question_id === q.id);
      return {
        ...q,
        chosen_option: ans ? ans.chosen_option : null,
        is_correct: ans ? ans.is_correct : false
      };
    });

    return {
      assignment: asg,
      activity,
      questions: questionsWithAnswers
    };
  }

  async getManagerStats(managerId) {
    // Isso demandaria refatoração massiva. Por enquanto, retornaremos os mesmos agregados
    // consultando tabelas separadas. (O ideal é criar uma view ou RPC no Supabase para isso).
    const [
      { data: teamUsers },
      { data: warmups },
      { data: activities },
      { data: questions },
      { data: answers }
    ] = await Promise.all([
      supabase.from('users').select('*').eq('manager_id', managerId).eq('role', 'funcionario'),
      supabase.from('warmups').select('*').eq('manager_id', managerId),
      supabase.from('activities').select('*, activity_assignments(*)').eq('manager_id', managerId),
      supabase.from('questions').select('*'),
      supabase.from('answers').select('*')
    ]);

    const activeTeamCount = teamUsers?.filter(u => u.status === 'active').length || 0;
    
    const activitiesStats = activities?.map(act => {
      const actAsgs = act.activity_assignments || [];
      const completed = actAsgs.filter(asg => asg.status === 'completed');
      let average = 0;
      if (completed.length > 0) {
        average = completed.reduce((acc, a) => acc + (a.score || 0), 0) / completed.length;
      }
      return {
        ...act,
        total_assigned: teamUsers?.length || 0,
        completed: completed.length,
        pending: (teamUsers?.length || 0) - completed.length,
        average_score: average
      };
    }) || [];

    return {
      total_team: teamUsers?.length || 0,
      active_team: activeTeamCount,
      warmups_count: warmups?.length || 0,
      activities: activitiesStats,
      attention_points: [] // Simplificando por enquanto
    };
  }

  async getAdminStats() {
    const [
      { count: activeEmployees },
      { count: gestoresCount },
      { count: unitsCount },
      { count: activitiesCount },
      { data: assignments }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'funcionario').eq('status', 'active'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'gestor'),
      supabase.from('units').select('*', { count: 'exact', head: true }),
      supabase.from('activities').select('*', { count: 'exact', head: true }),
      supabase.from('activity_assignments').select('score').eq('status', 'completed')
    ]);

    let averageScore = 0;
    if (assignments && assignments.length > 0) {
      averageScore = assignments.reduce((acc, a) => acc + (a.score || 0), 0) / assignments.length;
    }

    return {
      active_employees: activeEmployees || 0,
      gestores_count: gestoresCount || 0,
      units_count: unitsCount || 0,
      activities_count: activitiesCount || 0,
      assignments_completed: assignments?.length || 0,
      average_score: parseFloat(averageScore.toFixed(1)),
      unit_stats: [] // Simplificando
    };
  }

  async saveWorkSchedules(schedules) {
    const { error } = await supabase.from('work_schedules').upsert(schedules);
    if (error) {
      console.error('Erro ao salvar escalas:', error);
      return false;
    }
    return true;
  }
}

export const db = new SupabaseService();
export default db;
