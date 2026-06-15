import React, { useState, useEffect } from 'react';
import { useTasks, Task } from '../context/TaskContext';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending'
      });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task) {
        await updateTask(task._id, formData);
      } else {
        await createTask(formData);
      }
      onClose();
    } catch (error) {
      // toast is handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl shadow-black/50 w-full max-w-lg overflow-hidden transform transition-all">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-lg font-bold text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                style={{ colorScheme: 'dark' }}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
              >
                <option value="Low" className="bg-slate-900">Low</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="High" className="bg-slate-900">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
            >
              <option value="Pending" className="bg-slate-900">Pending</option>
              <option value="In Progress" className="bg-slate-900">In Progress</option>
              <option value="Completed" className="bg-slate-900">Completed</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
