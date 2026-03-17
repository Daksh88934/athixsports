"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Center, PresentationControls, useGLTF, Decal, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

function ShirtModel() {
  // Load the downloaded GLB 3D model
  const { nodes, materials } = useGLTF("/shirt_baked.glb");
  // Load the new trendy alien graphic for the chest piece
  const decalTexture = useTexture("/trending_alien.png");
  
  // Set material properties to a vibrant blue shade
  const material = materials.lambert1.clone();
  material.color = new THREE.Color("#2563eb"); // Royal Blue
  material.roughness = 0.8;
  material.metalness = 0.1;

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={material}
        scale={1.2}
      >
        <Decal
          position={[0, 0.04, 0.15]} // positioned in the center of the chest
          rotation={[0, 0, 0]}
          scale={[0.22, 0.22, 0.22]} // made larger for a full graphic print
          map={decalTexture}
          depthTest={true}
          transparent={true}
          opacity={0.9}
          material-blending={THREE.MultiplyBlending}
          material-premultipliedAlpha={true}
        />
      </mesh>
    </group>
  );
}

export default function ThreeDShirt() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "500px", position: "relative", cursor: "grab" }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        {/* Soft, studio-like lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />

        <Suspense fallback={null}>
          {/* PresentationControls allows 360 rotation & snaps back (or disabled snap) */}
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={false} // don't snap back to center when released
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 2, Math.PI / 2]}
            azimuth={[-Infinity, Infinity]} // 360 degree 
          >
            <Center>
              <ShirtModel />
            </Center>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Prefetch the models to avoid popping/flashing
useGLTF.preload("/shirt_baked.glb");
useTexture.preload("/trending_alien.png");
