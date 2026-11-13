const React = window.React;
function read(){ try{ return localStorage.getItem("theme")||"dark"; }catch(e){ return "dark"; } }
function apply(t){ document.documentElement.classList.toggle("dark", t==="dark"); }
exports.useTheme = function(){
  const [theme,set] = React.useState(read);
  React.useEffect(()=>{ apply(theme); },[theme]);
  return { theme, setTheme:(t)=>{ try{ localStorage.setItem("theme",t); }catch(e){} set(t); }, resolvedTheme: theme };
};
