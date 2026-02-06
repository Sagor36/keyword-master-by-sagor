
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatsBoardProps {
  tags: string[];
}

export const StatsBoard: React.FC<StatsBoardProps> = ({ tags }) => {
  const stats = useMemo(() => {
    // Basic heuristic to categorize tags for visualization
    const categorization = tags.reduce((acc, tag) => {
      const words = tag.split(' ').length;
      if (words === 1) acc.broad++;
      else if (words >= 3) acc.longTail++;
      else acc.standard++;
      return acc;
    }, { broad: 0, longTail: 0, standard: 0 });

    return [
      { name: 'Broad', value: categorization.broad, color: '#ef4444' },
      { name: 'Standard', value: categorization.standard, color: '#3b82f6' },
      { name: 'Long-tail', value: categorization.longTail, color: '#10b981' },
    ];
  }, [tags]);

  if (tags.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4 self-start">Keyword Breakdown</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center">
        <h3 className="text-lg font-semibold mb-4">Quick Insights</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg">
            <span className="text-zinc-400">Total Keywords</span>
            <span className="text-xl font-bold">{tags.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg">
            <span className="text-zinc-400">Avg. Length</span>
            <span className="text-xl font-bold">
              {(tags.reduce((a, b) => a + b.length, 0) / tags.length).toFixed(1)} chars
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-zinc-900/50 rounded-lg">
            <span className="text-zinc-400">SEO Score</span>
            <span className="text-xl font-bold text-green-400">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};
