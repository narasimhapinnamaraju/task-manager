import { useState, useMemo } from 'react';
import { useTasks, Task } from '../context/TaskContext';
import { Plus, Search, Filter, LayoutGrid, List as ListIcon, Edit2, Trash2, Calendar, Clock, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';

export default function Tasks() {
  const { tasks, isLoading, deleteTask } = useTasks();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(s));
    }
    if (statusFilter !== 'All') {
      result = result.filter(t => t.status === statusFilter);
    }
    if (priorityFilter !== 'All') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'Oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'Due Date': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'Newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="mt-1 text-sm text-slate-400">Manage your daily tasks and projects</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Task
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm appearance-none"
            >
              <option value="All" className="bg-slate-900 text-white">All Status</option>
              <option value="Pending" className="bg-slate-900 text-white">Pending</option>
              <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
              <option value="Completed" className="bg-slate-900 text-white">Completed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm appearance-none"
            >
              <option value="All" className="bg-slate-900 text-white">All Priorities</option>
              <option value="Low" className="bg-slate-900 text-white">Low</option>
              <option value="Medium" className="bg-slate-900 text-white">Medium</option>
              <option value="High" className="bg-slate-900 text-white">High</option>
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm appearance-none"
            >
              <option value="Newest" className="bg-slate-900 text-white">Newest First</option>
              <option value="Oldest" className="bg-slate-900 text-white">Oldest First</option>
              <option value="Due Date" className="bg-slate-900 text-white">Due Date</option>
            </select>
            <div className="flex items-center border border-white/10 rounded-lg p-1 bg-white/5">
              <button
                onClick={() => setView('grid')}
                className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="mx-auto w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
            <CheckSquare className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No tasks found</h3>
          <p className="mt-1 text-sm text-slate-400">Get started by creating a new task.</p>
          <button
            onClick={handleCreate}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-4 py-2 text-sm font-semibold hover:bg-indigo-600/30 transition-colors"
          >
            Create Task
          </button>
        </div>
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-white/5 backdrop-blur-md border border-white/5 hover:border-white/20 transition-all rounded-xl overflow-hidden ${view === 'list' ? 'flex flex-col sm:flex-row sm:items-center p-4 gap-4' : 'flex flex-col'}`}
            >
              <div className={`${view === 'grid' ? 'p-5 flex-1' : 'flex-1 min-w-0'}`}>
                <div className="flex items-start justify-between gap-2 max-w-full">
                  <h3 className="text-lg font-semibold text-white truncate" title={task.title}>{task.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center border rounded px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-nowrap
                      ${task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                      ${task.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                      ${task.priority === 'Low' ? 'bg-slate-700/50 text-slate-400 border-white/5' : ''}
                    `}>
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center border rounded px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-nowrap
                      ${task.status === 'Completed' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : ''}
                      ${task.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : ''}
                      ${task.status === 'Pending' ? 'bg-white/5 text-slate-400 border-white/10' : ''}
                    `}>
                      {task.status}
                    </span>
                  </div>
                </div>
                {view === 'grid' && (
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{task.description}</p>
                )}
                {view === 'list' && (
                   <div className="mt-1 flex items-center text-xs text-slate-500 gap-4">
                     {task.dueDate && (
                       <span className="flex items-center">
                         <Calendar className="w-3.5 h-3.5 mr-1" />
                         {format(new Date(task.dueDate), 'MMM d, yyyy')}
                       </span>
                     )}
                   </div>
                )}
              </div>
              
              <div className={`${view === 'grid' ? 'px-5 py-4 bg-white/5 border-t border-white/5' : ''} flex items-center justify-between`}>
                {view === 'grid' && (
                  <div className="flex items-center text-sm text-slate-500">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setTaskToDelete(task._id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={taskToEdit}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
