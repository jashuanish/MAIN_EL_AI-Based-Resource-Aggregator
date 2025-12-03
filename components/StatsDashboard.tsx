import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserStats } from '../types';
import { Trophy, Flame, Clock, Target } from 'lucide-react';

interface StatsDashboardProps {
  stats: UserStats;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({
  icon,
  label,
  value,
  color
}) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Trophy size={20} />} 
          label="Topics Mastered" 
          value={stats.topicsCompleted} 
          color="bg-yellow-500" 
        />
        <StatCard 
          icon={<Flame size={20} />} 
          label="Day Streak" 
          value={stats.streakDays} 
          color="bg-orange-500" 
        />
        <StatCard 
          icon={<Clock size={20} />} 
          label="Learning Hours" 
          value={stats.totalHours} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={<Target size={20} />} 
          label="Avg Completion" 
          value={`${stats.resourceCompletion}%`} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-6">Learning Activity</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyActivity}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {stats.weeklyActivity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.hours > 3 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
