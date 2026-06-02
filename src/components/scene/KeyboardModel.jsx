import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useConfigStore } from '../../store/configStore'

function hexToColor(hex) {
  try { return new THREE.Color(hex || '#333344') }
  catch { return new THREE.Color('#333344') }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

// Animated wrapper: moves toward target Y each frame
function AnimatedGroup({ targetY, children, delay = 0 }) {
  const ref = useRef()
  const current = useRef(targetY)

  useFrame(() => {
    if (!ref.current) return
    current.current = lerp(current.current, targetY, 0.07)
    ref.current.position.y = current.current
  })

  return <group ref={ref}>{children}</group>
}

// --- Case ---
function CaseMesh({ cfg, exploded, highlighted }) {
  const isAlu = cfg?.material === 'aluminum'
  const color = hexToColor(cfg?.color)

  return (
    <AnimatedGroup targetY={exploded ? -0.6 : 0}>
      <RoundedBox args={[5.2, 0.36, 1.95]} radius={0.07} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={color}
          metalness={isAlu ? 0.88 : 0.05}
          roughness={isAlu ? 0.18 : 0.55}
          clearcoat={isAlu ? 1.0 : 0.2}
          clearcoatRoughness={0.08}
          emissive={highlighted ? color : new THREE.Color(0x000000)}
          emissiveIntensity={highlighted ? 0.12 : 0}
        />
      </RoundedBox>
    </AnimatedGroup>
  )
}

// --- PCB ---
function PCBMesh({ cfg, exploded, highlighted }) {
  const ref = useRef()
  const isRGB = cfg?.rgb

  useFrame(({ clock }) => {
    if (ref.current && isRGB) {
      ref.current.emissiveIntensity = 0.25 + Math.sin(clock.elapsedTime * 2.5) * 0.1
    }
  })

  return (
    <AnimatedGroup targetY={exploded ? 0.12 : 0.2}>
      <RoundedBox args={[4.9, 0.05, 1.72]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial
          ref={ref}
          color={highlighted ? '#44ff88' : '#1a3d1a'}
          metalness={0.2}
          roughness={0.75}
          emissive={isRGB ? new THREE.Color('#00ff55') : new THREE.Color('#003300')}
          emissiveIntensity={isRGB ? 0.25 : 0.04}
        />
      </RoundedBox>
    </AnimatedGroup>
  )
}

// --- Plate ---
function PlateMesh({ cfg, exploded, highlighted }) {
  const isAlu = cfg?.material === 'aluminum'
  const isPoly = cfg?.material === 'polycarbonate'

  return (
    <AnimatedGroup targetY={exploded ? 0.6 : 0.25}>
      <RoundedBox args={[4.8, 0.045, 1.62]} radius={0.02} smoothness={2} castShadow>
        <meshPhysicalMaterial
          color={isAlu ? '#909090' : isPoly ? '#aabbdd' : '#888866'}
          metalness={isAlu ? 0.78 : 0.0}
          roughness={isAlu ? 0.25 : 0.6}
          transparent={isPoly}
          opacity={isPoly ? 0.75 : 1.0}
          emissive={highlighted ? new THREE.Color('#8888ff') : new THREE.Color('#000000')}
          emissiveIntensity={highlighted ? 0.18 : 0}
        />
      </RoundedBox>
    </AnimatedGroup>
  )
}

// --- Single Key ---
function Key({ position, switchCfg, keycapCfg, isAccent }) {
  const switchColor = hexToColor(switchCfg?.color)
  const keycapColor = hexToColor(isAccent ? keycapCfg?.accentColor : keycapCfg?.color)

  return (
    <group position={position}>
      {/* Switch housing */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.12, 0.16, 0.12]} />
        <meshPhysicalMaterial color={switchColor} metalness={0.0} roughness={0.6} transparent opacity={0.92} />
      </mesh>
      {/* Keycap */}
      <RoundedBox args={[0.285, 0.075, 0.285]} radius={0.022} smoothness={3} position={[0, 0.45, 0]} castShadow>
        <meshPhysicalMaterial
          color={keycapColor}
          metalness={0.0}
          roughness={0.72}
          clearcoat={0.15}
        />
      </RoundedBox>
    </group>
  )
}

// --- Switches + Keycap Grid ---
function KeyGrid({ switchCfg, keycapCfg, pcbCfg, exploded, highlighted }) {
  const keys = useMemo(() => {
    const rows = [
      { count: 14, z: -0.65, xStart: -2.37, xStep: 0.368 },
      { count: 14, z: -0.28, xStart: -2.20, xStep: 0.368 },
      { count: 13, z:  0.09, xStart: -2.02, xStep: 0.368 },
      { count: 12, z:  0.46, xStart: -1.84, xStep: 0.368 },
      { count:  5, z:  0.83, xStart: -0.74, xStep: 0.368 },
    ]
    const out = []
    rows.forEach(({ count, z, xStart, xStep }) => {
      for (let i = 0; i < count; i++) {
        out.push({ pos: [xStart + i * xStep, 0, z], accent: (i + Math.floor(z * 3)) % 5 === 0 })
      }
    })
    return out
  }, [])

  return (
    <AnimatedGroup targetY={exploded ? 1.2 : 0.28}>
      {keys.map(({ pos, accent }, i) => (
        <Key
          key={i}
          position={pos}
          switchCfg={switchCfg}
          keycapCfg={keycapCfg}
          isAccent={accent}
        />
      ))}
    </AnimatedGroup>
  )
}

// --- RGB underglow strip ---
function RGBStrip({ pcbCfg }) {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.emissive.setHSL((clock.elapsedTime * 0.08) % 1, 1.0, 0.5)
      ref.current.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 3) * 0.2
    }
  })

  if (!pcbCfg?.rgb) return null

  return (
    <mesh position={[0, -0.17, 0.88]}>
      <boxGeometry args={[4.8, 0.025, 0.05]} />
      <meshStandardMaterial ref={ref} color="#000" emissive="#ff00ff" emissiveIntensity={1} />
    </mesh>
  )
}

export default function KeyboardModel() {
  const { config, exploded, highlightedPart } = useConfigStore()

  return (
    <group rotation={[-0.12, 0.28, 0]}>
      <CaseMesh    cfg={config.case}     exploded={exploded} highlighted={highlightedPart === 'case'} />
      <PCBMesh     cfg={config.pcb}      exploded={exploded} highlighted={highlightedPart === 'pcb'} />
      <PlateMesh   cfg={config.plate}    exploded={exploded} highlighted={highlightedPart === 'plate'} />
      <KeyGrid
        switchCfg={config.switches}
        keycapCfg={config.keycaps}
        pcbCfg={config.pcb}
        exploded={exploded}
        highlighted={highlightedPart === 'switches' || highlightedPart === 'keycaps'}
      />
      <RGBStrip pcbCfg={config.pcb} />
    </group>
  )
}
