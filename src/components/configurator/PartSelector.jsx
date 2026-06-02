import { useState } from 'react'
import { PARTS } from '../../data/products'
import { useConfigStore } from '../../store/configStore'
import { useChatStore } from '../../store/chatStore'

const CATEGORIES = [
  { id: 'case', label: 'Case', icon: '⬛', parts: 'cases' },
  { id: 'switches', label: 'Switches', icon: '🔴', parts: 'switches' },
  { id: 'keycaps', label: 'Keycaps', icon: '⌨️', parts: 'keycaps' },
  { id: 'pcb', label: 'PCB', icon: '💻', parts: 'pcb' },
  { id: 'plate', label: 'Plate', icon: '▭', parts: 'plates' },
]

function PartCard({ part, isSelected, onSelect, category }) {
  const { setHighlighted } = useConfigStore()

  return (
    <button
      onClick={() => onSelect(part)}
      onMouseEnter={() => setHighlighted(category)}
      onMouseLeave={() => setHighlighted(null)}
      style={{
        width: '100%',
        padding: '10px 12px',
        background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
        border: isSelected ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Color swatch if part has color */}
        {part.color && (
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: part.color,
            border: '2px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
            boxShadow: `0 0 8px ${part.color}60`,
          }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: isSelected ? '#a5b4fc' : '#e2e8f0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {part.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            {part.specs && Object.values(part.specs).slice(0, 2).join(' · ')}
          </div>
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: isSelected ? '#818cf8' : '#94a3b8',
          flexShrink: 0,
        }}>
          ${part.price}
        </div>
      </div>
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 3,
          height: '100%',
          background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
          borderRadius: '0 10px 10px 0',
        }} />
      )}
    </button>
  )
}

export default function PartSelector() {
  const [activeCategory, setActiveCategory] = useState('case')
  const { config, setPart, compatibility } = useConfigStore()
  const { setOpen } = useChatStore()

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)
  const availableParts = PARTS[activeCat.parts] || []
  const selectedPart = config[activeCategory]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* Category tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflowX: 'auto',
        flexShrink: 0,
      }}>
        {CATEGORIES.map(cat => {
          const hasError = compatibility?.errors?.some(e =>
            e.affectedParts?.includes(cat.id) && !e.valid
          )
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: activeCategory === cat.id
                  ? 'rgba(99,102,241,0.2)'
                  : 'transparent',
                color: activeCategory === cat.id ? '#a5b4fc' : '#64748b',
                position: 'relative',
                transition: 'all 0.15s',
              }}
            >
              {cat.label}
              {hasError && (
                <span style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#ef4444',
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Parts list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {availableParts.map(part => (
          <PartCard
            key={part.id}
            part={part}
            isSelected={selectedPart?.id === part.id}
            onSelect={(p) => setPart(activeCategory, p)}
            category={activeCategory}
          />
        ))}
      </div>

      {/* Compatibility warnings */}
      {compatibility?.warnings?.length > 0 && (
        <div style={{
          margin: '0 16px 12px',
          padding: '10px 12px',
          background: 'rgba(251,191,36,0.1)',
          border: '1px solid rgba(251,191,36,0.3)',
          borderRadius: 10,
          fontSize: 12,
          color: '#fbbf24',
        }}>
          ⚠️ {compatibility.warnings[0].warning}
        </div>
      )}

      {/* Compatibility errors */}
      {compatibility?.errors?.filter(e => !e.valid).length > 0 && (
        <div style={{
          margin: '0 16px 12px',
          padding: '10px 12px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10,
          fontSize: 12,
          color: '#f87171',
        }}>
          ❌ {compatibility.errors.find(e => !e.valid)?.error}
        </div>
      )}

      {/* Ask AI button */}
      <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 10,
            color: '#a5b4fc',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.2s',
          }}
        >
          ✨ Ask Max for recommendations
        </button>
      </div>
    </div>
  )
}
