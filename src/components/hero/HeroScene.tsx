import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

function ParticleField() {
  const count = 1800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#58a6ff"
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.75}
      />
    </Points>
  );
}

function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (outer.current) {
      outer.current.rotation.y = t * 0.18;
      outer.current.rotation.x = Math.sin(t * 0.12) * 0.25;
      outer.current.position.y = Math.sin(t * 0.6) * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.12;
      inner.current.rotation.z = t * 0.08;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial color="#6ff6ff" wireframe transparent opacity={0.85} />
      </mesh>
      <mesh ref={inner}>
        <octahedronGeometry args={[0.95, 0]} />
        <meshBasicMaterial color="#58a6ff" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

function PointerRig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    target.current.x = state.pointer.x * 0.28;
    target.current.y = state.pointer.y * 0.16;
    if (group.current) {
      group.current.rotation.y += (target.current.x - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-target.current.y - group.current.rotation.x) * 0.04;
    }
  });

  return <group ref={group}>{children}</group>;
}

function CameraDrift() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.08) * 0.4;
    camera.position.y = 1.3 + Math.sin(t * 0.05) * 0.15;
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export function HeroScene({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 1.3, 6.4], fov: 42 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 7, 20]} />
      <ambientLight intensity={0.3} />
      <CameraDrift />
      <PointerRig>
        <Core />
        <ParticleField />
      </PointerRig>
      <Grid
        position={[0, -1.7, 0]}
        args={[10.5, 10.5]}
        cellColor="#12233a"
        sectionColor="#58a6ff"
        sectionThickness={1}
        cellThickness={0.5}
        cellSize={0.6}
        sectionSize={3}
        fadeDistance={22}
        fadeStrength={1.4}
        infiniteGrid
      />
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0.12} intensity={0.75} mipmapBlur radius={0.6} />
        <Vignette eskil={false} offset={0.25} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
