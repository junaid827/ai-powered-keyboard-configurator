import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import KeyboardModel from './KeyboardModel'

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#c0c8ff" />
      <directionalLight position={[5, 10, 5]} intensity={2.5} castShadow color="#ffffff" />
      <directionalLight position={[-5, 4, -3]} intensity={1.0} color="#4455ff" />
      <pointLight position={[0, -1, 2]} intensity={0.8} color="#6655ff" />
    </>
  )
}

function Effects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.8} intensity={0.5} mipmapBlur />
      <Vignette offset={0.15} darkness={0.5} />
    </EffectComposer>
  )
}

export default function KeyboardScene() {
  return (
    <Canvas
      camera={{ position: [0, 4, 8], fov: 40 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Lights />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <KeyboardModel />
        <ContactShadows
          position={[0, -1.25, 0]}
          opacity={0.6}
          scale={8}
          blur={2}
          far={4}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        minDistance={4}
        maxDistance={14}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.06}
      />

      <Effects />
    </Canvas>
  )
}
