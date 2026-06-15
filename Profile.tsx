import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { User as UserIcon, Mail, Calendar } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account information</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-5">
            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Standard User</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Full name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member since
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'Recently joined'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
