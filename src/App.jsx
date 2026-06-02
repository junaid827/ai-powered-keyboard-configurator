import KeyboardScene from './components/scene/KeyboardScene'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import ChatPanel from './components/chat/ChatPanel'

export default function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: '#08080f',
      overflow: 'hidden',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* 3D Viewport */}
      <div style={{
        flex: 1,
        position: 'relative',
        height: '100%',
        minWidth: 0,
        background: 'radial-gradient(ellipse at 40% 50%, #0d0d2a 0%, #08080f 70%)',
      }}>
        <Header />

        {/* Canvas must be in a sized container */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <KeyboardScene />
        </div>

        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          fontSize: 11,
          color: '#2a3040',
          display: 'flex',
          gap: 16,
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          <span>🖱 Drag to rotate</span>
          <span>📐 Scroll to zoom</span>
        </div>
      </div>

      {/* Right sidebar */}
      <Sidebar />

      {/* Floating AI chat */}
      <ChatPanel />
    </div>
  )
}
