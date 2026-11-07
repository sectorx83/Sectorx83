import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import vertexShader from "../shaders/nebula.vert?raw";
import fragmentShader from "../shaders/nebula.frag?raw";

function Core() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uIntensity: { value: 1 },
    uDeep: { value: new THREE.Color("#10051f") },
    uGlow: { value: new THREE.Color("#8d2f9d") },
    uHot: { value: new THREE.Color("#ff79c6") }
  }), []);

  const palette = ["#10051f", "#8d2f9d", "#ff79c6"];

  useFrame((state, delta) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
      material.current.uniforms.uPointer.value.lerp(pointer, Math.min(delta * 2, 1));
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.055;
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.12, 2, delta);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh scale={1.68}>
          <icosahedronGeometry args={[1, 96]} />
          <shaderMaterial
            ref={material}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.FrontSide}
          />
        </mesh>
        <mesh scale={1.72}>
          <icosahedronGeometry args={[1, 4]} />
          <meshBasicMaterial color={palette[2]} wireframe transparent opacity={0.075} />
        </mesh>
      </Float>
      <mesh rotation={[Math.PI / 2.4, 0.2, -0.35]} scale={[2.45, 0.72, 0.72]}>
        <torusGeometry args={[1, 0.0035, 8, 220]} />
        <meshBasicMaterial color={palette[1]} transparent opacity={0.56} />
      </mesh>
      <mesh rotation={[0.9, -0.6, 0.45]} scale={[2.7, 0.78, 0.78]}>
        <torusGeometry args={[1, 0.0025, 8, 220]} />
        <meshBasicMaterial color={palette[2]} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Scene() {
  const palette = ["#10051f", "#8d2f9d", "#ff79c6"];
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={18} color={palette[2]} />
      <pointLight position={[-4, -2, -3]} intensity={8} color={palette[1]} />
      <Core />
      <Sparkles count={96} scale={7} size={1.9} speed={0.35} opacity={0.58} color={palette[2]} />
      <Stars radius={22} depth={18} count={480} factor={2.2} saturation={0} fade speed={0.3} />
    </>
  );
}

export default function Experience() {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}