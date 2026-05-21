"use client";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// primitives/flow-gradient/flow/index.tsx
import { useRef, useEffect as useEffect2 } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// lib/hooks/use-reduced-motion.ts
import { useEffect, useState } from "react";
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// primitives/flow-gradient/flow/presets.ts
var FLOW_GRADIENT_PRESETS = {
  stripe: {
    colors: ["#7C3AED", "#2563EB", "#0D9488", "#DB2777", "#D97706"]
  },
  sunset: {
    colors: ["#EA580C", "#DB2777", "#D97706", "#DC2626", "#9333EA"]
  },
  ocean: {
    colors: ["#0369A1", "#0891B2", "#0D9488", "#1D4ED8", "#6366F1"]
  },
  ember: {
    colors: ["#DC2626", "#EA580C", "#D97706", "#B91C1C", "#F59E0B"]
  },
  mint: {
    colors: ["#059669", "#0D9488", "#0891B2", "#16A34A", "#2563EB"]
  }
};

// primitives/flow-gradient/flow/index.tsx
var ROTATION_Z = Math.PI * 35 / 180;
var RIBBON_W = 22;
var RIBBON_H = 0.42;
var RIBBON_SEGS = 128;
var vertexShader = (
  /* glsl */
  `
  uniform float uTime;
  uniform float uWaveSpeed;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uPhase;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Sine wave displacement along Z \u2014 ribbon undulates in depth
    float wave = sin(pos.x * uFrequency + uTime * uWaveSpeed + uPhase)
               + 0.4 * sin(pos.x * uFrequency * 1.8 + uTime * uWaveSpeed * 0.6 + uPhase + 1.0);
    pos.z += wave * uAmplitude;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`
);
var fragmentShader = (
  /* glsl */
  `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    // Smooth alpha falloff from ribbon center \u2192 edges
    float edge  = abs(vUv.y - 0.5) * 2.0;        // 0 = center, 1 = edge
    float alpha = smoothstep(1.0, 0.20, edge) * uOpacity;

    // Soft fade at the ribbon's horizontal ends
    float ends  = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    alpha *= ends;

    gl_FragColor = vec4(uColor, alpha);
  }
`
);
function Ribbon({ color, yOffset, phaseOffset, amplitude, frequency, waveSpeed }) {
  const matRef = useRef(null);
  const reduced = useReducedMotion();
  const uniforms = useRef({
    uTime: { value: 0 },
    uWaveSpeed: { value: waveSpeed },
    uAmplitude: { value: amplitude },
    uFrequency: { value: frequency },
    uPhase: { value: phaseOffset },
    uColor: { value: new THREE.Color(color) },
    uOpacity: { value: 0.78 }
  });
  useEffect2(() => {
    uniforms.current.uColor.value.set(color);
    uniforms.current.uWaveSpeed.value = waveSpeed;
  }, [color, waveSpeed]);
  useFrame((state) => {
    if (reduced || !matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });
  return /* @__PURE__ */ React.createElement("mesh", { position: [0, yOffset, 0], rotation: [0, 0, ROTATION_Z] }, /* @__PURE__ */ React.createElement("planeGeometry", { args: [RIBBON_W, RIBBON_H, RIBBON_SEGS, 1] }), /* @__PURE__ */ React.createElement(
    "shaderMaterial",
    {
      ref: matRef,
      vertexShader,
      fragmentShader,
      uniforms: uniforms.current,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    }
  ));
}
function RibbonScene({ colors, speed }) {
  var _a;
  const { viewport } = useThree();
  const palette = [...colors];
  while (palette.length < 5) palette.push((_a = palette[palette.length - 1]) != null ? _a : "#7C3AED");
  const five = palette.slice(0, 5);
  const spread = viewport.height * 0.82;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, five.map((color, i) => /* @__PURE__ */ React.createElement(
    Ribbon,
    {
      key: i,
      color,
      yOffset: (i / (five.length - 1) - 0.5) * spread,
      phaseOffset: i * (Math.PI * 2 / five.length),
      amplitude: 0.24 + i * 0.04,
      frequency: 0.68 + i * 0.17,
      waveSpeed: speed * (0.38 + i * 0.1)
    }
  )));
}
function FlowGradient({
  preset = "stripe",
  colors,
  speed = 1,
  className,
  style
}) {
  var _a, _b;
  const resolvedColors = (_b = colors != null ? colors : (_a = FLOW_GRADIENT_PRESETS[preset]) == null ? void 0 : _a.colors) != null ? _b : FLOW_GRADIENT_PRESETS.stripe.colors;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({ position: "relative", width: "100%", height: "100%", overflow: "hidden" }, style)
    },
    /* @__PURE__ */ React.createElement(
      Canvas,
      {
        camera: { position: [0, 0, 5], fov: 60, near: 0.1, far: 100 },
        gl: { antialias: true, alpha: false },
        dpr: [1, 2],
        style: { position: "absolute", inset: 0, background: "#06060a" }
      },
      /* @__PURE__ */ React.createElement(RibbonScene, { colors: resolvedColors, speed })
    )
  );
}

// primitives/flow-gradient/spotlight/index.tsx
import { useRef as useRef2, useMemo } from "react";
import { Canvas as Canvas2, useFrame as useFrame2 } from "@react-three/fiber";
import * as THREE2 from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// primitives/flow-gradient/spotlight/presets.ts
var SPOTLIGHT_GRADIENT_PRESETS = {
  cool: {
    color: "#6366F1",
    secondColor: "#0891B2"
  },
  warm: {
    color: "#F59E0B",
    secondColor: "#EA580C"
  },
  electric: {
    color: "#A855F7",
    secondColor: "#3B82F6"
  },
  rose: {
    color: "#EC4899",
    secondColor: "#F43F5E"
  }
};

// primitives/flow-gradient/spotlight/index.tsx
var PATH_SEGS = 32;
var RADIAL_SEGS = 6;
var TUBE_RADIUS = 0.035;
function NeonTube({
  color,
  basePoints,
  phaseOffset,
  speedScale,
  speed,
  reduced
}) {
  const meshRef = useRef2(null);
  const curve = useMemo(
    () => new THREE2.CatmullRomCurve3([...basePoints], false, "catmullrom", 0.5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const initGeom = useMemo(
    () => new THREE2.TubeGeometry(curve, PATH_SEGS, TUBE_RADIUS, RADIAL_SEGS, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useFrame2((state) => {
    if (reduced || !meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed * speedScale;
    curve.points = basePoints.map((p, i) => {
      const ph = i * 0.9 + phaseOffset;
      return new THREE2.Vector3(
        p.x + Math.sin(t * 0.4 + ph) * 0.55,
        p.y + Math.cos(t * 0.32 + ph * 1.3) * 0.38,
        p.z + Math.sin(t * 0.28 + ph * 0.7) * 0.2
      );
    });
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = new THREE2.TubeGeometry(
      curve,
      PATH_SEGS,
      TUBE_RADIUS,
      RADIAL_SEGS,
      false
    );
  });
  return /* @__PURE__ */ React.createElement("mesh", { ref: meshRef, geometry: initGeom }, /* @__PURE__ */ React.createElement(
    "meshStandardMaterial",
    {
      color,
      emissive: color,
      emissiveIntensity: 5,
      toneMapped: false
    }
  ));
}
function NeonScene({
  color,
  secondColor,
  speed
}) {
  const reduced = useReducedMotion();
  const tubes = useMemo(() => [
    {
      color,
      basePoints: [
        new THREE2.Vector3(-5, 0.5, 0),
        new THREE2.Vector3(-2, 1, 0.5),
        new THREE2.Vector3(0, 0, -0.3),
        new THREE2.Vector3(2, -0.8, 0.4),
        new THREE2.Vector3(5, 0.3, 0)
      ],
      phaseOffset: 0,
      speedScale: 1
    },
    {
      color: secondColor,
      basePoints: [
        new THREE2.Vector3(-5, -0.8, 0.2),
        new THREE2.Vector3(-1.5, 0.4, -0.4),
        new THREE2.Vector3(0.5, -0.3, 0.5),
        new THREE2.Vector3(2.5, 0.9, -0.2),
        new THREE2.Vector3(5, -0.4, 0)
      ],
      phaseOffset: 2.1,
      speedScale: 0.82
    },
    {
      color,
      basePoints: [
        new THREE2.Vector3(-4.5, 1.2, -0.3),
        new THREE2.Vector3(-1, -0.6, 0.6),
        new THREE2.Vector3(1.2, 0.8, -0.5),
        new THREE2.Vector3(3.5, -0.2, 0.3),
        new THREE2.Vector3(5, 0.9, -0.1)
      ],
      phaseOffset: 4.2,
      speedScale: 1.15
    }
  ], [color, secondColor]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("ambientLight", { intensity: 0.05 }), tubes.map((t, i) => /* @__PURE__ */ React.createElement(NeonTube, __spreadProps(__spreadValues({ key: i }, t), { speed, reduced }))), /* @__PURE__ */ React.createElement(EffectComposer, null, /* @__PURE__ */ React.createElement(
    Bloom,
    {
      intensity: 1.4,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.3,
      mipmapBlur: true
    }
  )));
}
function SpotlightGradient({
  preset = "cool",
  color,
  secondColor,
  speed = 1,
  className,
  style
}) {
  const resolved = SPOTLIGHT_GRADIENT_PRESETS[preset];
  const c1 = color != null ? color : resolved.color;
  const c2 = secondColor != null ? secondColor : resolved.secondColor;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#06060a"
      }, style)
    },
    /* @__PURE__ */ React.createElement(
      Canvas2,
      {
        camera: { position: [0, 0, 6], fov: 50, near: 0.1, far: 100 },
        gl: { antialias: true, alpha: true, toneMapping: THREE2.NoToneMapping },
        dpr: [1, 2],
        style: { position: "absolute", inset: 0 }
      },
      /* @__PURE__ */ React.createElement(NeonScene, { color: c1, secondColor: c2, speed })
    )
  );
}

// primitives/flow-gradient/mesh/index.tsx
import { useEffect as useEffect3, useRef as useRef3 } from "react";

// primitives/flow-gradient/mesh/presets.ts
var MESH_GRADIENT_PRESETS = {
  cosmos: {
    // Dark purple-to-indigo-to-teal sweep
    colors: ["#1E0A3C", "#2D1B69", "#0F172A", "#3B0764", "#1E3A5F", "#0D2137", "#4C1D95", "#1D4ED8", "#0D9488"]
  },
  dawn: {
    // Warm sand, peach, rose — light mode feel
    colors: ["#FEF3C7", "#FDE68A", "#FCA5A5", "#FECACA", "#FDE8D8", "#FBCFE8", "#F9A8D4", "#FED7AA", "#FEF9C3"]
  },
  forest: {
    // Deep greens and teals
    colors: ["#052E16", "#064E3B", "#0A2E1A", "#134E4A", "#0F3460", "#065F46", "#1A3A4A", "#0D4429", "#0C4A6E"]
  },
  candy: {
    // Bright saturated — pink/purple/blue
    colors: ["#BE185D", "#7C3AED", "#1D4ED8", "#DB2777", "#9333EA", "#2563EB", "#EC4899", "#A855F7", "#3B82F6"]
  }
};

// primitives/flow-gradient/mesh/index.tsx
function MeshGradient({
  preset = "cosmos",
  colors,
  speed = 1,
  className,
  style
}) {
  var _a, _b;
  const canvasRef = useRef3(null);
  const reduced = useReducedMotion();
  const rafRef = useRef3(0);
  const resolvedColors = (_b = colors != null ? colors : (_a = MESH_GRADIENT_PRESETS[preset]) == null ? void 0 : _a.colors) != null ? _b : MESH_GRADIENT_PRESETS.cosmos.colors;
  useEffect3(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const FIBER_COUNT = 120;
    let fibers = [];
    let width = 0;
    let height = 0;
    function initFibers() {
      fibers = Array.from({ length: FIBER_COUNT }, (_, i) => {
        const color = resolvedColors[i % resolvedColors.length];
        const vertical = i % 5 === 0;
        const margin = 0.15;
        let x0, y0, x1, y1;
        if (vertical) {
          x0 = -margin + Math.random() * (1 + margin * 2);
          y0 = -margin;
          x1 = -margin + Math.random() * (1 + margin * 2);
          y1 = 1 + margin;
        } else {
          x0 = -margin;
          y0 = Math.random();
          x1 = 1 + margin;
          y1 = Math.random();
        }
        const cx0 = 0.1 + Math.random() * 0.8;
        const cy0 = 0.1 + Math.random() * 0.8;
        const cx1 = 0.1 + Math.random() * 0.8;
        const cy1 = 0.1 + Math.random() * 0.8;
        const drift = 15e-5 * speed;
        return {
          x0,
          y0,
          x1,
          y1,
          cx0,
          cy0,
          cx1,
          cy1,
          vcx0: (Math.random() - 0.5) * drift,
          vcy0: (Math.random() - 0.5) * drift,
          vcx1: (Math.random() - 0.5) * drift,
          vcy1: (Math.random() - 0.5) * drift,
          color,
          alpha: 0.08 + Math.random() * 0.55,
          lineWidth: 0.3 + Math.random() * 1.4
        };
      });
    }
    function init(w, h) {
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      initFibers();
    }
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      init(Math.round(rect.width) || 1, Math.round(rect.height) || 1);
    });
    observer.observe(canvas);
    init(canvas.offsetWidth || 800, canvas.offsetHeight || 600);
    function draw() {
      ctx.fillStyle = "#06060a";
      ctx.fillRect(0, 0, width, height);
      for (const f of fibers) {
        if (!reduced) {
          f.cx0 += f.vcx0;
          f.cy0 += f.vcy0;
          f.cx1 += f.vcx1;
          f.cy1 += f.vcy1;
          if (f.cx0 <= 0 || f.cx0 >= 1) f.vcx0 *= -1;
          if (f.cy0 <= 0 || f.cy0 >= 1) f.vcy0 *= -1;
          if (f.cx1 <= 0 || f.cx1 >= 1) f.vcx1 *= -1;
          if (f.cy1 <= 0 || f.cy1 >= 1) f.vcy1 *= -1;
        }
        ctx.globalAlpha = f.alpha;
        ctx.strokeStyle = f.color;
        ctx.lineWidth = f.lineWidth;
        ctx.beginPath();
        ctx.moveTo(f.x0 * width, f.y0 * height);
        ctx.bezierCurveTo(
          f.cx0 * width,
          f.cy0 * height,
          f.cx1 * width,
          f.cy1 * height,
          f.x1 * width,
          f.y1 * height
        );
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resolvedColors, speed, reduced]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({ position: "relative", width: "100%", height: "100%", overflow: "hidden" }, style)
    },
    /* @__PURE__ */ React.createElement(
      "canvas",
      {
        ref: canvasRef,
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      }
    )
  );
}

// primitives/flow-gradient/noise/index.tsx
import { useEffect as useEffect4, useRef as useRef4 } from "react";

// primitives/flow-gradient/noise/presets.ts
var NOISE_GRADIENT_PRESETS = {
  void: {
    // Purple / violet / white — generative art classic
    colors: ["#4c026b", "#730d9e", "#9622c7", "#b44ae0", "#cd72f2", "#ffffff"]
  },
  dusk: {
    // Blue / teal / indigo — digital ocean
    colors: ["#0891b2", "#0d9488", "#6366f1", "#8b5cf6", "#a78bfa", "#38bdf8"]
  },
  forest: {
    // Green / emerald / teal — living system
    colors: ["#065f46", "#059669", "#10b981", "#34d399", "#0d9488", "#6ee7b7"]
  },
  cherry: {
    // Pink / rose / white — blossom
    colors: ["#be185d", "#db2777", "#ec4899", "#f9a8d4", "#fda4af", "#ffffff"]
  }
};

// primitives/flow-gradient/noise/index.tsx
function NoiseGradient({
  preset = "void",
  colors,
  speed = 1,
  frequency = 0.012,
  className,
  style
}) {
  const canvasRef = useRef4(null);
  const reduced = useReducedMotion();
  const rafRef = useRef4(0);
  const resolvedColors = colors != null ? colors : NOISE_GRADIENT_PRESETS[preset].colors;
  useEffect4(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const CELL_SIZE = 5;
    const PARTICLE_COUNT = 2e3;
    const CURVE = 5;
    let width = 0;
    let height = 0;
    let cols = 0;
    let flowField = new Float32Array(0);
    let particles = [];
    function buildFlowField() {
      const rows = Math.floor(height / CELL_SIZE);
      cols = Math.floor(width / CELL_SIZE);
      flowField = new Float32Array(rows * cols);
      const zoom = frequency;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          flowField[y * cols + x] = (Math.sin(x * zoom) + Math.cos(y * zoom)) * CURVE;
        }
      }
    }
    function resetParticle(p) {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.history = [{ x: p.x, y: p.y }];
      p.maxLength = Math.floor(Math.random() * 150 + 10);
      p.timer = p.maxLength * 2;
    }
    function init(w, h) {
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      buildFlowField();
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const p = {
          x: 0,
          y: 0,
          color: resolvedColors[Math.floor(Math.random() * resolvedColors.length)],
          history: [],
          maxLength: 0,
          speedModifier: Math.floor(Math.random() * 4 + 1),
          timer: 0
        };
        resetParticle(p);
        return p;
      });
    }
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      init(Math.round(rect.width) || 1, Math.round(rect.height) || 1);
    });
    observer.observe(canvas);
    init(canvas.offsetWidth || 800, canvas.offsetHeight || 600);
    function draw() {
      ctx.fillStyle = "#06060a";
      ctx.fillRect(0, 0, width, height);
      if (!reduced) {
        const maxCols = cols;
        const maxRows = Math.floor(height / CELL_SIZE);
        for (const p of particles) {
          p.timer--;
          if (p.timer >= 1) {
            const cx = Math.floor(p.x / CELL_SIZE);
            const cy = Math.floor(p.y / CELL_SIZE);
            if (cx >= 0 && cx < maxCols && cy >= 0 && cy < maxRows) {
              const angle = flowField[cy * cols + cx];
              p.x += Math.cos(angle) * p.speedModifier * speed;
              p.y += Math.sin(angle) * p.speedModifier * speed;
              p.history.push({ x: p.x, y: p.y });
              if (p.history.length > p.maxLength) p.history.shift();
            } else {
              resetParticle(p);
            }
          } else if (p.history.length > 1) {
            p.history.shift();
          } else {
            resetParticle(p);
          }
          if (p.history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
              ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [resolvedColors, speed, reduced, frequency]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({ position: "relative", width: "100%", height: "100%", overflow: "hidden" }, style)
    },
    /* @__PURE__ */ React.createElement(
      "canvas",
      {
        ref: canvasRef,
        style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
      }
    )
  );
}

// primitives/flow-gradient/aurora/index.tsx
import { useRef as useRef5, useMemo as useMemo2, useEffect as useEffect5 } from "react";
import { Canvas as Canvas3, useFrame as useFrame3, useThree as useThree2 } from "@react-three/fiber";
import * as THREE3 from "three";

// primitives/flow-gradient/aurora/presets.ts
var AURORA_GRADIENT_PRESETS = {
  nordic: {
    // Cyan + purple — matches the neon particle wave reference image exactly
    colors: ["#06B6D4", "#7C3AED"]
  },
  plasma: {
    // Bright magenta + electric blue
    colors: ["#E879F9", "#3B82F6"]
  },
  void: {
    // Dark teal + dark indigo — subtle, near-monochrome
    colors: ["#0891B2", "#3730A3"]
  },
  twilight: {
    // Rose + amber — warm neon sunset
    colors: ["#F43F5E", "#D97706"]
  }
};

// primitives/flow-gradient/aurora/index.tsx
var COLS = 160;
var ROWS = 38;
var N = COLS * ROWS;
var vertexShader2 = (
  /* glsl */
  `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uPhase;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Three-component compound wave \u2014 slow large + medium ripple + fine detail.
    // Frequencies tuned so ~2.5 full cycles are visible across the viewport.
    float wave = sin(pos.x * 0.82 + uTime * uSpeed        + uPhase       ) * 1.15
               + sin(pos.x * 2.10 + uTime * uSpeed * 1.55 + uPhase * 1.8 ) * 0.32
               + sin(pos.x * 4.90 + uTime * uSpeed * 0.75 + uPhase * 0.6 ) * 0.11;
    pos.y += wave;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    // Point size: 3.5px base, slight depth boost for front-layer sheets
    gl_PointSize = clamp(3.8 + (-mvPos.z * 0.07), 2.5, 6.0);

    // Alpha: brighter at wave crests, dimmer at troughs \u2014 creates the
    // illusion of a lit surface rather than a flat grid
    vAlpha = 0.50 + 0.50 * (sin(pos.x * 0.82 + uTime * uSpeed + uPhase) * 0.5 + 0.5);

    gl_Position = projectionMatrix * mvPos;
  }
`
);
var fragmentShader2 = (
  /* glsl */
  `
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    // Crisp circle \u2014 discard anything outside the dot radius
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;

    // Very slight softness at the very edge (< 1px feather)
    float alpha = vAlpha * smoothstep(0.5, 0.28, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`
);
function WaveSheet({
  color,
  yCenter,
  zOffset,
  phaseOffset,
  speed,
  sheetW,
  sheetH
}) {
  const matRef = useRef5(null);
  const reduced = useReducedMotion();
  const positions = useMemo2(() => {
    const arr = new Float32Array(N * 3);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const i = (row * COLS + col) * 3;
        arr[i] = (col / (COLS - 1) - 0.5) * sheetW;
        arr[i + 1] = (row / (ROWS - 1) - 0.5) * sheetH + yCenter;
        arr[i + 2] = zOffset;
      }
    }
    return arr;
  }, [sheetW, sheetH, yCenter, zOffset]);
  const uniforms = useRef5({
    uTime: { value: 0 },
    uSpeed: { value: speed },
    uPhase: { value: phaseOffset },
    uColor: { value: new THREE3.Color(color) }
  });
  useEffect5(() => {
    uniforms.current.uColor.value.set(color);
    uniforms.current.uSpeed.value = speed;
  }, [color, speed]);
  useFrame3((state) => {
    if (reduced || !matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
  });
  return /* @__PURE__ */ React.createElement("points", null, /* @__PURE__ */ React.createElement("bufferGeometry", null, /* @__PURE__ */ React.createElement("bufferAttribute", { attach: "attributes-position", args: [positions, 3] })), /* @__PURE__ */ React.createElement(
    "shaderMaterial",
    {
      ref: matRef,
      vertexShader: vertexShader2,
      fragmentShader: fragmentShader2,
      uniforms: uniforms.current,
      transparent: true,
      depthWrite: false,
      blending: THREE3.AdditiveBlending
    }
  ));
}
function WaveScene({ colors, speed }) {
  var _a, _b;
  const { viewport } = useThree2();
  const color1 = (_a = colors[0]) != null ? _a : "#06B6D4";
  const color2 = (_b = colors[colors.length - 1]) != null ? _b : "#7C3AED";
  const sheetW = viewport.width * 1.08;
  const sheetH = viewport.height * 0.58;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    WaveSheet,
    {
      color: color1,
      yCenter: 0.18,
      zOffset: 0,
      phaseOffset: 0,
      speed,
      sheetW,
      sheetH
    }
  ), /* @__PURE__ */ React.createElement(
    WaveSheet,
    {
      color: color2,
      yCenter: -0.18,
      zOffset: -0.6,
      phaseOffset: Math.PI * 0.72,
      speed: speed * 0.82,
      sheetW,
      sheetH
    }
  ));
}
function AuroraGradient({
  preset = "nordic",
  colors,
  speed = 1,
  className,
  style
}) {
  var _a, _b;
  const resolvedColors = (_b = colors != null ? colors : (_a = AURORA_GRADIENT_PRESETS[preset]) == null ? void 0 : _a.colors) != null ? _b : AURORA_GRADIENT_PRESETS.nordic.colors;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#06060a"
      }, style)
    },
    /* @__PURE__ */ React.createElement(
      Canvas3,
      {
        camera: { position: [0, 0, 10], fov: 55, near: 0.1, far: 100 },
        gl: { antialias: true, alpha: true },
        dpr: [1, 2],
        style: { position: "absolute", inset: 0 }
      },
      /* @__PURE__ */ React.createElement(WaveScene, { colors: resolvedColors, speed })
    )
  );
}

// primitives/flow-gradient/wave-grid/index.tsx
import { useRef as useRef6, useMemo as useMemo3, useEffect as useEffect6, useCallback } from "react";
import { Canvas as Canvas4, useFrame as useFrame4, useThree as useThree3 } from "@react-three/fiber";
import * as THREE4 from "three";

// primitives/flow-gradient/wave-grid/presets.ts
var WAVE_GRID_PRESETS = {
  white: { color: "#ffffff" },
  // original Three.js example — pure white
  ocean: { color: "#06B6D4" },
  // cyan-teal
  neon: { color: "#A855F7" },
  // electric purple
  ember: { color: "#F97316" },
  // orange
  plasma: { color: "#EC4899" }
  // hot pink
};

// primitives/flow-gradient/wave-grid/index.tsx
var SEPARATION = 100;
var vertexShader3 = (
  /* glsl */
  `
  attribute float scale;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Perspective-correct point size: larger near camera, smaller far.
    // The 300.0 constant is taken directly from the Three.js original.
    gl_PointSize = scale * (300.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
  }
`
);
var fragmentShader3 = (
  /* glsl */
  `
  uniform vec3 color;

  void main() {
    // Crisp circle \u2014 matches the original's 0.475 radius exactly
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    gl_FragColor = vec4(color, 1.0);
  }
`
);
function WaveScene2({ color, speed, amountX, amountY, followMouse, mouseRef }) {
  const { camera } = useThree3();
  const reduced = useReducedMotion();
  const geoRef = useRef6(null);
  const countRef = useRef6(0);
  const numParticles = amountX * amountY;
  const { positions, scales } = useMemo3(() => {
    const positions2 = new Float32Array(numParticles * 3);
    const scales2 = new Float32Array(numParticles);
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        positions2[i] = ix * SEPARATION - amountX * SEPARATION / 2;
        positions2[i + 1] = 0;
        positions2[i + 2] = iy * SEPARATION - amountY * SEPARATION / 2;
        scales2[j] = 1;
        i += 3;
        j++;
      }
    }
    return { positions: positions2, scales: scales2 };
  }, [numParticles, amountX, amountY]);
  const uniforms = useMemo3(() => ({
    color: { value: new THREE4.Color(color) }
  }), [color]);
  useEffect6(() => {
    uniforms.color.value.set(color);
  }, [color, uniforms]);
  useFrame4(() => {
    if (!geoRef.current) return;
    const posArr = geoRef.current.attributes.position.array;
    const scaleArr = geoRef.current.attributes.scale.array;
    const count = countRef.current;
    let i = 0;
    let j = 0;
    for (let ix = 0; ix < amountX; ix++) {
      for (let iy = 0; iy < amountY; iy++) {
        posArr[i + 1] = Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
        scaleArr[j] = (Math.sin((ix + count) * 0.3) + 1) * 20 + (Math.sin((iy + count) * 0.5) + 1) * 20;
        i += 3;
        j++;
      }
    }
    geoRef.current.attributes.position.needsUpdate = true;
    geoRef.current.attributes.scale.needsUpdate = true;
    if (followMouse && mouseRef.current) {
      camera.position.x += (mouseRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y - camera.position.y) * 0.05;
    }
    camera.lookAt(0, 0, 0);
    if (!reduced) countRef.current += 0.1 * speed;
  });
  return /* @__PURE__ */ React.createElement("points", null, /* @__PURE__ */ React.createElement("bufferGeometry", { ref: geoRef }, /* @__PURE__ */ React.createElement("bufferAttribute", { attach: "attributes-position", args: [positions, 3] }), /* @__PURE__ */ React.createElement("bufferAttribute", { attach: "attributes-scale", args: [scales, 1] })), /* @__PURE__ */ React.createElement(
    "shaderMaterial",
    {
      uniforms,
      vertexShader: vertexShader3,
      fragmentShader: fragmentShader3
    }
  ));
}
function WaveGrid({
  preset = "white",
  color,
  speed = 1,
  amountX = 50,
  amountY = 50,
  followMouse = true,
  className,
  style
}) {
  var _a, _b;
  const resolvedColor = (_b = color != null ? color : (_a = WAVE_GRID_PRESETS[preset]) == null ? void 0 : _a.color) != null ? _b : "#ffffff";
  const mouseRef = useRef6({ x: 0, y: 0 });
  const handlePointerMove = useCallback((e) => {
    if (!e.isPrimary) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left - rect.width / 2;
    mouseRef.current.y = e.clientY - rect.top - rect.height / 2;
  }, []);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className,
      style: __spreadValues({
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#000000"
      }, style),
      onPointerMove: followMouse ? handlePointerMove : void 0
    },
    /* @__PURE__ */ React.createElement(
      Canvas4,
      {
        camera: { position: [0, 0, 1e3], fov: 75, near: 1, far: 1e4 },
        gl: { antialias: true, alpha: false },
        dpr: [1, 2],
        style: { position: "absolute", inset: 0 }
      },
      /* @__PURE__ */ React.createElement(
        WaveScene2,
        {
          color: resolvedColor,
          speed,
          amountX,
          amountY,
          followMouse,
          mouseRef
        }
      )
    )
  );
}
export {
  AuroraGradient,
  FlowGradient,
  MeshGradient,
  NoiseGradient,
  SpotlightGradient,
  WaveGrid
};
//# sourceMappingURL=index.mjs.map