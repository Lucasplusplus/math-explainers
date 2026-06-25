import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// The hero surface is a real function sampled on a grid: height = f(x, z, t)
// = sin(x*ωx + t*sx) * cos(z*ωz + t*sz). x and z are the two spatial inputs
// (z is mapped to depth, not screen-up, so the grid reads as a ground plane
// receding toward a horizon); the output height becomes world-Y. The cursor
// adds a second, independent term: a Gaussian ripple centered on a
// spring-damped point that chases the pointer, which is what gives the
// "settles, doesn't snap" feel instead of linear follow.
// ─────────────────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aBrightness;
  varying float vBrightness;
  void main() {
    vBrightness = aBrightness;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (16.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG = /* glsl */ `
  varying float vBrightness;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    float d = length(c);
    float circle = smoothstep(0.5, 0.4, d);
    if (circle <= 0.001) discard;
    gl_FragColor = vec4(vec3(vBrightness), circle);
  }
`;

const NEAR_Z = 2.5;
const FAR_Z = -13;
const HALF_W = 7.5;
const AMP = 1.05;

function buildGrid(cols, rows) {
  const count = cols * rows;
  const position = new Float32Array(count * 3);
  const baseX = new Float32Array(count);
  const baseZ = new Float32Array(count);
  const aSize = new Float32Array(count);
  const aBrightness = new Float32Array(count);

  let k = 0;
  for (let j = 0; j < rows; j++) {
    const z = NEAR_Z + (j / (rows - 1)) * (FAR_Z - NEAR_Z);
    for (let i = 0; i < cols; i++) {
      const x = -HALF_W + (i / (cols - 1)) * (HALF_W * 2);
      baseX[k] = x;
      baseZ[k] = z;
      position[k * 3] = x;
      position[k * 3 + 1] = 0;
      position[k * 3 + 2] = z;
      k++;
    }
  }
  return { count, position, baseX, baseZ, aSize, aBrightness };
}

function Field({ cols, rows, still, sampleRef }) {
  const grid = useMemo(() => buildGrid(cols, rows), [cols, rows]);
  const geomRef = useRef();
  const pointsRef = useRef();

  const spring = useRef({ x: 0, z: -5, vx: 0, vz: 0, target: { x: 0, z: -5 } });
  const strength = useRef({ value: 0, target: 0 });
  const t = useRef(0);
  const drewStaticFrame = useRef(false);

  const { invalidate } = useThree();

  const heightAt = (x, z, time) =>
    Math.sin(x * 0.5 + time * 0.5) * Math.cos(z * 0.45 + time * 0.35) * AMP;

  useFrame((_, delta) => {
    if (still && drewStaticFrame.current) return;
    const dt = Math.min(delta, 0.05);
    t.current += still ? 0 : dt;

    // critically-under-damped spring chasing the pointer target — slight
    // overshoot is the point, a linear lerp would read as robotic.
    const s = spring.current;
    const stiffness = 120;
    const damping = 13;
    const ax = (s.target.x - s.x) * stiffness - s.vx * damping;
    const az = (s.target.z - s.z) * stiffness - s.vz * damping;
    s.vx += ax * dt;
    s.vz += az * dt;
    s.x += s.vx * dt;
    s.z += s.vz * dt;

    // smooth the ripple's amplitude toward 0/1 so it fades rather than snaps
    const st = strength.current;
    st.value += (st.target - st.value) * (1 - Math.exp(-dt * 6));

    const { position, baseX, baseZ, aSize, aBrightness, count } = grid;
    const time = t.current;
    let sampleHeight = 0;
    let sampleBest = Infinity;

    for (let k = 0; k < count; k++) {
      const x = baseX[k];
      const z = baseZ[k];
      const h = heightAt(x, z, time);

      const dx = x - s.x;
      const dz = z - s.z;
      const dist2 = dx * dx + dz * dz;
      const ripple =
        st.value *
        0.85 *
        Math.exp(-dist2 / (2 * 1.6 * 1.6)) *
        Math.sin(Math.sqrt(dist2) * 2.2 - time * 4);

      const y = h + ripple;
      position[k * 3 + 1] = y;

      const depthT = Math.min(Math.max((NEAR_Z - z) / (NEAR_Z - FAR_Z), 0), 1);
      const norm = Math.min(Math.max((y + AMP) / (2 * AMP), 0), 1);
      const fall = Math.pow(1 - depthT, 1.4);

      aBrightness[k] = (0.22 + 0.65 * norm) * fall;
      aSize[k] = (1.5 + 2.6 * norm) * Math.pow(1 - depthT, 0.9);

      if (dist2 < sampleBest) {
        sampleBest = dist2;
        sampleHeight = y;
      }
    }

    if (sampleRef) sampleRef.current = sampleHeight;

    const geom = geomRef.current;
    if (geom) {
      geom.attributes.position.needsUpdate = true;
      geom.attributes.aBrightness.needsUpdate = true;
      geom.attributes.aSize.needsUpdate = true;
    }

    if (still) {
      drewStaticFrame.current = true;
    } else {
      invalidate();
    }
  });

  const handlePointerMove = (e) => {
    if (still) return;
    spring.current.target.x = e.point.x;
    spring.current.target.z = e.point.z;
    strength.current.target = 1;
    invalidate();
  };
  const handlePointerLeave = () => {
    strength.current.target = 0;
    invalidate();
  };

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" args={[grid.position, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[grid.aSize, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[grid.aBrightness, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* invisible ground plane just to capture pointer position in world space */}
      <mesh
        position={[0, 0, (NEAR_Z + FAR_Z) / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[HALF_W * 2 + 4, NEAR_Z - FAR_Z + 4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

export default function FunctionField({ light = false, still = false, sampleRef }) {
  const cols = light ? 46 : 108;
  const rows = light ? 30 : 68;

  return (
    <Canvas
      dpr={[1, light ? 1.25 : 1.6]}
      gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
      frameloop={still ? "demand" : "always"}
      camera={{ position: [0, 4.6, 9.5], fov: 42 }}
      onCreated={({ camera, scene }) => {
        camera.lookAt(0, 0, -4.5);
        scene.background = new THREE.Color("#0a0a0a");
      }}
    >
      <Field cols={cols} rows={rows} still={still} sampleRef={sampleRef} />
    </Canvas>
  );
}
