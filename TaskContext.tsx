import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  createdAt: string;
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (task: Partial<Task>) => {
    try {
      const { data } = await axios.post('/api/tasks', task);
      setTasks(prev => [data, ...prev]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id: string, taskUpdates: Partial<Task>) => {
    try {
      const { data } = await axios.put(`/api/tasks/${id}`, taskUpdates);
      setTasks(prev => prev.map(t => t._id === id ? data : t));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
