import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { cities, getAqiColor } from "@/data/cities";
import earthNightTexture from "@/assets/earth-night.jpg";

function EarthWithMarkers({
  simulationIntensity = 0,
  onCitySelect,
  selectedCity,
}: {
  simulationIntensity?: number;
  onCitySelect: (city: (typeof cities)[0]) => void;
  selectedCity: (typeof cities)[0] | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, earthNightTexture);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const smogOpacity = 0.08 + simulationIntensity * 0.15;

  return (
    <group ref={groupRef}>
      {/* Earth sphere with night texture */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color={new THREE.Color("hsl(200, 80%, 50%)")}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Smog layer */}
      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial
          color={new THREE.Color(`hsl(${30 - simulationIntensity * 30}, 60%, 40%)`)}
          transparent
          opacity={smogOpacity}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial
          color={new THREE.Color("hsl(200, 80%, 50%)")}
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* City markers - inside the group so they rotate with Earth */}
      {cities.map((city) => (
        <CityMarker
          key={city.name}
          city={city}
          onSelect={onCitySelect}
          isSelected={selectedCity?.name === city.name}
          simulationIntensity={simulationIntensity}
        />
      ))}
    </group>
  );
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function CityMarker({
  city,
  onSelect,
  isSelected,
  simulationIntensity = 0,
}: {
  city: (typeof cities)[0];
  onSelect: (city: (typeof cities)[0]) => void;
  isSelected: boolean;
  simulationIntensity?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  const position = useMemo(() => latLngToVector3(city.lat, city.lng, 2.03), [city.lat, city.lng]);

  const adjustedAqi = Math.min(500, city.aqi + simulationIntensity * 100);
  const color = new THREE.Color(getAqiColor(adjustedAqi));
  const scale = isSelected ? 1.8 : 1;

  useFrame((_state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 2;
      const s = ringRef.current.scale.x;
      if (s > 2.5) {
        ringRef.current.scale.set(1, 1, 1);
      } else {
        ringRef.current.scale.multiplyScalar(1 + delta * 0.5);
      }
    }
  });

  const handleClick = useCallback(() => {
    onSelect(city);
  }, [city, onSelect]);

  return (
    <group position={position}>
      <mesh scale={scale} onClick={handleClick}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>

      {/* Glow */}
      <mesh scale={scale * 2}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Pulse ring */}
      {isSelected && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.06, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function FloatingParticles({ count = 200, simulationIntensity = 0 }: { count?: number; simulationIntensity?: number }) {
  const particlesRef = useRef<THREE.Points>(null);
  const totalCount = count + Math.floor(simulationIntensity * 300);

  const positions = useMemo(() => {
    const pos = new Float32Array(totalCount * 3);
    for (let i = 0; i < totalCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [totalCount]);

  useFrame((_state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.01;
      particlesRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={totalCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color={new THREE.Color("hsl(170, 80%, 50%)")}
        transparent
        opacity={0.4 + simulationIntensity * 0.3}
        sizeAttenuation
      />
    </points>
  );
}

function CameraController({ target }: { target?: THREE.Vector3 }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 6));

  useFrame(() => {
    if (target) {
      targetPos.current.lerp(target.clone().multiplyScalar(2.5), 0.02);
    } else {
      targetPos.current.lerp(new THREE.Vector3(0, 0, 6), 0.02);
    }
    camera.position.lerp(targetPos.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

interface GlobeSceneProps {
  onCitySelect: (city: (typeof cities)[0] | null) => void;
  selectedCity: (typeof cities)[0] | null;
  simulationIntensity: number;
  entered: boolean;
}

export default function GlobeScene({
  onCitySelect,
  selectedCity,
  simulationIntensity,
  entered,
}: GlobeSceneProps) {
  const cameraTarget = useMemo(() => {
    if (!selectedCity) return undefined;
    return latLngToVector3(selectedCity.lat, selectedCity.lng, 2.03);
  }, [selectedCity]);

  return (
    <Canvas
      camera={{ position: [0, 0, entered ? 6 : 12], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#060b18"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 5, 10]} intensity={0.8} color="#4dd0e1" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#1a237e" />

      <Stars radius={100} depth={50} count={3000} factor={3} fade speed={0.5} />
      <FloatingParticles simulationIntensity={simulationIntensity} />

      <EarthWithMarkers
        simulationIntensity={simulationIntensity}
        onCitySelect={onCitySelect}
        selectedCity={selectedCity}
      />

      <CameraController target={cameraTarget} />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3.5}
        maxDistance={12}
        autoRotate={!selectedCity}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
