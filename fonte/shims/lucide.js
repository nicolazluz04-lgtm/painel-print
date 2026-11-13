const g = window.LucideReact || window.lucideReact || {};
const R = window.React;
const Empty = function Empty(){ return null; };
const names = ['Activity', 'AlertTriangle', 'Ban', 'BarChart3', 'BellRing', 'CheckCircle2', 'ChevronLeft', 'ChevronRight', 'Clock', 'Eye', 'FileDown', 'FileText', 'GitBranch', 'LayoutDashboard', 'LogIn', 'LogOut', 'MapPin', 'Monitor', 'Moon', 'Package', 'Pencil', 'Phone', 'Plus', 'ScrollText', 'Search', 'ShieldCheck', 'Sun', 'Timer', 'Trash2', 'TrendingUp', 'Upload', 'UserPlus', 'Users', 'X'];
names.forEach(n => { exports[n] = g[n] || Empty; });
