const g = window.Recharts || {};
const R = window.React;
const Pass = function Pass(p){ return R.createElement("div", null, p && p.children); };
const names = ['Bar', 'BarChart', 'CartesianGrid', 'Cell', 'Legend', 'Pie', 'PieChart', 'ResponsiveContainer', 'Tooltip', 'XAxis', 'YAxis'];
names.forEach(n => { exports[n] = g[n] || Pass; });
