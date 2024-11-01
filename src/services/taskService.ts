import { supabase } from "@/integrations/supabase/client";
import { TaskType } from "@/types/task";

export const createTask = async (task: Omit<TaskType, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_fkey(name),
      creator:profiles!tasks_created_by_fkey(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, updates: Partial<TaskType>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getTaskHistory = async (taskId: string) => {
  const { data, error } = await supabase
    .from('task_history')
    .select(`
      *,
      changed_by:profiles!task_history_changed_by_fkey(name)
    `)
    .eq('task_id', taskId)
    .order('changed_at', { ascending: false });

  if (error) throw error;
  return data;
};