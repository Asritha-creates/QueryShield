import React from 'react';

interface QueryTableProps {
  data: any[];
}

export const QueryTable: React.FC<QueryTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500 text-sm">No results found for this query.</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-bottom border-slate-200">
            {columns.map((col) => (
              <th 
                key={col} 
                className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col} className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                  {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
