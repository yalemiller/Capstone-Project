import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function BarChart({ data, xKey, bars, height = 400, className = '' }) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fill: '#333', fontSize: 14 }}
            axisLine={{ stroke: '#333' }}
          />
          <YAxis 
            tick={{ fill: '#333', fontSize: 14 }}
            axisLine={{ stroke: '#333' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '2px solid #2ea3bd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '14px' }}
          />
          {bars.map((bar, index) => (
            <Bar 
              key={index}
              dataKey={bar.dataKey} 
              fill={bar.fill} 
              name={bar.name || bar.dataKey}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}