import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle, ListTodo, CircleDashed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
  const { tasks, isLoading } = useTasks();
  const { user } = useAuth();

  if (isLoading) {
    return <div className="animate-pulse flex space-y-4 flex-col"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div><div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div></div>;
  }

  const statCards = [
    { name: 'Total Tasks', value: tasks.length, icon: ListTodo, color: 'bg-blue-500' },
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length, icon: CheckCircle, color: 'bg-emerald-500' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, icon: CircleDashed, color: 'bg-amber-500' },
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length, icon: Clock, color: 'bg-gray-500' },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/tasks"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
          >
            Manage Tasks
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <stat.icon className="w-4 h-4 opacity-50" /> {stat.name}
            </p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View all</Link>
        </div>
        <ul className="divide-y divide-white/5">
          {recentTasks.length === 0 ? (
            <li className="px-5 py-8 text-center text-slate-500">No tasks yet</li>
          ) : (
            recentTasks.map((task) => (
              <li key={task._id} className="p-5 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-white truncate">{task.title}</p>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center text-xs text-slate-400 gap-1 sm:gap-4 flex-wrap">
                      {task.dueDate && <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex gap-2">
                    <span className={`inline-flex items-center border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider
                      ${task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      ${task.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                      ${task.priority === 'Low' ? 'bg-slate-700/50 text-slate-400 border-white/5' : ''}
                    `}>
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center border rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider
                      ${task.status === 'Completed' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : ''}
                      ${task.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                      ${task.status === 'Pending' ? 'bg-white/5 text-slate-400 border-white/10' : ''}
                    `}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
