// Standalone app mount — fills viewport, no device frame
function StandaloneRoot() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: 500,
      margin: '0 auto',
      background: '#F6EBDA',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, system-ui',
      // desktop-only shadow so it looks contained on wider screens
      boxShadow: window.innerWidth > 520 ? '0 0 40px rgba(0,0,0,0.15)' : 'none',
    }}>
      <App/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<StandaloneRoot/>);
