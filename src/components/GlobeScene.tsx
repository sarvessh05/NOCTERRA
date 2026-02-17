import { useRef, useMemo, useCallback, useEffect, useState } from "react";
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
  
  const staticCities = useMemo(() => getActiveCities(), []);
  const cities = useRealtimeAQI(staticCities, 30000);

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

      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#4fa3ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial
          color={new THREE.Color(`hsl(${30 - simulationIntensity * 30}, 60%, 40%)`)}
          transparent
          opacity={smogOpacity}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </Sphere>

      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial
          color="#4fa3ff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

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

      <mesh scale={scale * 2}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

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

function RareComet({ 
  selectedCity, 
  lastInteractionTime 
}: { 
  selectedCity: CityData | null;
  lastInteractionTime: number;
}) {
  const cometRef = useRef<THREE.Group>(null);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastCometTime = useRef(0);
  const nextCheckTime = useRef(Date.now() + Math.random() * 15000 + 25000);
  
  const startPoint = useRef(new THREE.Vector3());
  const endPoint = useRef(new THREE.Vector3());
  const duration = useRef(1.0);

  useFrame((state) => {
    const now = Date.now();
    const timeSinceInteraction = now - lastInteractionTime;
    const timeSinceLastComet = now - lastCometTime.current;
    
    if (!isActive && now >= nextCheckTime.current) {
      if (
        !selectedCity &&
        timeSinceInteraction > 10000 &&
        timeSinceLastComet > 120000
      ) {
        const chance = Math.random();
        if (chance < 0.015) {
          const angle1 = Math.random() * Math.PI * 2;
          const angle2 = angle1 + (Math.random() * 0.4 + 0.3) * (Math.random() > 0.5 ? 1 : -1);
          const radius = 8;
          const height = 3 + Math.random() * 2;
          
          startPoint.current.set(
            Math.cos(angle1) * radius,
            height,
            Math.sin(angle1) * radius
          );
          
          endPoint.current.set(
            Math.cos(angle2) * radius,
            height - (Math.random() * 1.5 + 0.5),
            Math.sin(angle2) * radius
          );
          
          duration.current = 0.9 + Math.random() * 0.4;
          
          setIsActive(true);
          setProgress(0);
          lastCometTime.current = now;
        }
      }
      
      nextCheckTime.current = now + Math.random() * 15000 + 25000;
    }
    
    if (isActive && cometRef.current) {
      const delta = state.clock.getDelta();
      const newProgress = progress + (delta / duration.current);
      
      if (newProgress >= 1.1) {
        setIsActive(false);
        setProgress(0);
      } else {
        setProgress(newProgress);
        
        const t = Math.min(newProgress, 1);
        const curve = t * t * (3 - 2 * t);
        
        cometRef.current.position.lerpVectors(startPoint.current, endPoint.current, curve);
        
        const direction = new THREE.Vector3().subVectors(endPoint.current, startPoint.current).normalize();
        cometRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
        
        let opacity = 1;
        if (newProgress < 0.15) {
          opacity = newProgress / 0.15;
        } else if (newProgress > 1.0) {
          opacity = Math.max(0, 1 - (newProgress - 1.0) * 10);
        } else if (newProgress > 0.85) {
          opacity = 1 - ((newProgress - 0.85) / 0.15) * 0.3;
        }
        
        cometRef.current.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
            if (index === 0) {
              child.material.opacity = opacity * 0.95;
            } else {
              child.material.opacity = opacity * (0.4 - index * 0.08);
            }
          }
        });
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={cometRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial 
          color="#f5f3ea" 
          transparent 
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <mesh position={[0, 0, 0.02]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial 
          color="#fff8e7" 
          transparent 
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {[0.15, 0.35, 0.6, 0.9, 1.25].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} scale={[1 - i * 0.15, 1 - i * 0.15, 1]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial 
            color={i < 2 ? "#f5f3ea" : "#e8e6d8"}
            transparent 
            opacity={0.4 - i * 0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
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
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  
  const cameraTarget = useMemo(() => {
    if (!selectedCity) return undefined;
    return latLngToVector3(selectedCity.lat, selectedCity.lng, 2.03);
  }, [selectedCity]);

  useEffect(() => {
    setLastInteractionTime(Date.now());
  }, [selectedCity]);

  const handleInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

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
      onPointerDown={handleInteraction}
      onWheel={handleInteraction}
    >
      <color attach="background" args={["#060b18"]} />
      
      <ambientLight intensity={0.2} />

      <Stars radius={100} depth={50} count={3000} factor={3} fade speed={0.5} />
      <FloatingParticles simulationIntensity={simulationIntensity} />

      <EarthWithMarkers
        simulationIntensity={simulationIntensity}
        onCitySelect={onCitySelect}
        selectedCity={selectedCity}
      />

      <RareComet 
        selectedCity={selectedCity}
        lastInteractionTime={lastInteractionTime}
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
