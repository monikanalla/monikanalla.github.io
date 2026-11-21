import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Offline studio reflections — no external HDR fetch. */
function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = pmrem.fromScene(room, 0.04).texture;

    scene.environment = texture;
    return () => {
      scene.environment = null;
      texture.dispose();
      pmrem.dispose();
      room.dispose();
    };
  }, [gl, scene]);

  return null;
}

function ChromeKnot() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    node.rotation.y += delta * 0.22;
    node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, 0.35 + state.pointer.y * 0.35, 0.05);
    node.rotation.z = THREE.MathUtils.lerp(node.rotation.z, state.pointer.x * 0.3, 0.05);
    node.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.09;
  });

  return (
    <group ref={group}>
      <mesh>
        <torusKnotGeometry args={[1.02, 0.3, 260, 40, 2, 3]} />
        <meshPhysicalMaterial
          color="#fbf7ef"
          metalness={1}
          roughness={0.14}
          clearcoat={1}
          clearcoatRoughness={0.12}
          envMapIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

function Orbit() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.18;
    mesh.current.rotation.x = 1.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1.85, 0.012, 12, 200]} />
      <meshStandardMaterial color="#7C1B26" metalness={0.6} roughness={0.35} />
    </mesh>
  );
}

function Beads() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  const beads = [
    { position: [2.05, 0.75, 0.3], size: 0.13 },
    { position: [-1.95, -0.55, 0.55], size: 0.09 },
    { position: [0.4, -1.55, -0.6], size: 0.16 },
    { position: [-0.9, 1.6, -0.4], size: 0.07 },
  ] as const;

  return (
    <group ref={group}>
      {beads.map((bead, index) => (
        <mesh key={index} position={bead.position as unknown as [number, number, number]}>
          <sphereGeometry args={[bead.size, 32, 32]} />
          <meshPhysicalMaterial color="#f7f2e8" metalness={0.95} roughness={0.16} envMapIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 6.6], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#fffaf1" />
      <directionalLight position={[-5, -2, 3]} intensity={0.8} color="#f3e3d6" />
      <pointLight position={[2.5, 1.5, -3]} intensity={6} distance={12} color="#7C1B26" />

      <group rotation={[0.16, 0, -0.1]} scale={0.92}>
        <ChromeKnot />
        <Orbit />
        <Beads />
      </group>
    </Canvas>
  );
}
