const React = window.React;
class Boundary extends React.Component {
  constructor(p){ super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err){ try{ console.error("Falha em componente:", err && err.message); }catch(e){} }
  render(){
    if (this.state.err) return React.createElement("div", { style:{padding:12,fontSize:12,opacity:.7} }, "Este bloco não pôde ser carregado.");
    return this.props.children;
  }
}
module.exports = function dynamic(loader){
  const L = React.lazy(() => loader().then(m => ({ default: (m && m.default) || m })));
  return function Dyn(props){ return React.createElement(Boundary, null, React.createElement(React.Suspense, {fallback:null}, React.createElement(L, props))); };
};
module.exports.default = module.exports;
