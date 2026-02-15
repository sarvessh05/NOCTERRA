import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";
import { getActiveCities, getAqiColor, CityData } from "@/data/cities";
import { useRealtimeAQI } from "@/hooks/use-realtime-aqi";
import earthNightTexture from "@/assets/earth-night.jpg";

function EarthWithMarkers({
  simulationIntensity = 0,
  onCitySelect,
  selectedCity,
}: {
  simulationIntensity?: number;
  onCitySelect: (city: CityData) => void;
  selectedCity: CityData | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  
  const nightMap = useLoader(THREE.TextureLoader, earthNightTexture);
  
  // Get active cities for today and apply real-time AQI updates
  const staticCities = useMemo(() => getActiveCities(), []);
  const cities = useRealtimeAQI(staticCities, 30000); // Update every 30 seconds

  useEffect(() => {
    if (nightMap) {
      nightMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    }
  }, [nightMap, gl]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
    
    if (earthRef.current) {
      const material = earthRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 1.8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const smogOpacity = 0.08 + simulationIntensity * 0.15;

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with emissive night lights */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial
          map={nightMap}
          emissiveMap={nightMap}
          emissive="#ffffff"
          emissiveIntensity={1.8}
          roughness={1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Emissive glow layer - simulates bloom effect */}
      <mesh>
        <sphereGeometry args={[2.01, 128, 128]} />
        <meshBasicMaterial
          map={nightMap}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Cinematic atmosphere rim - subtle halo */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#4fa3ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
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

      {/* Outer atmospheric glow */}
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial
          color="#4fa3ff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
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
  city: CityData;
  onSelect: (city: CityData) => void;
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
  onCitySelect: (city: CityData | null) => void;
  selectedCity: CityData | null;
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
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
    >
      <color attach="background" args={["#060b18"]} />
      
      {/* Minimal lighting - emissive dominance for night mode */}
      <ambientLight intensity={0.2} />

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
        enableRotate={true}
        minDistance={3.5}
        maxDistance={12}
        autoRotate={!selectedCity}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
      />
    </Canvas>
  );
}
