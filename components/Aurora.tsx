"use client"

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#7cff67', '#171D22', '#7cff67'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  intensity = 1.0,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animateIdRef = useRef<number>(0);

  const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

  const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uIntensity;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensityVal = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensityVal);
  
  vec3 auroraColor = rampColor;
  
  float finalAlpha = auroraAlpha * smoothstep(0.0, 0.5, intensityVal) * uIntensity;
  
  // 调整颜色亮度以便在黑色背景上更合适
  auroraColor = pow(auroraColor, vec3(0.8)) * 1.2;
  
  fragColor = vec4(auroraColor * finalAlpha, finalAlpha);
}
`;

  const initAurora = () => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });

    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program: Program | undefined;

    const resize = () => {
      if (!container) return;

      const parentWidth = container.parentElement?.offsetWidth || container.offsetWidth || window.innerWidth;
      const parentHeight = container.parentElement?.offsetHeight || container.offsetHeight || window.innerHeight;

      const width = Math.max(parentWidth, 300);
      const height = Math.max(parentHeight, 300);

      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    };

    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: {
          value: [
            Math.max(container.parentElement?.offsetWidth || container.offsetWidth || window.innerWidth, 300),
            Math.max(container.parentElement?.offsetHeight || container.offsetHeight || window.innerHeight, 300)
          ]
        },
        uBlend: { value: blend },
        uIntensity: { value: intensity }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);

    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';

    const update = (t: number) => {
      animateIdRef.current = requestAnimationFrame(update);
      const time = t * 0.01; // 修复：移除硬编码的0值
      const speedValue = speed ?? 1.0;
      if (program) {
        program.uniforms.uTime.value = time * speedValue * 0.1;
        program.uniforms.uAmplitude.value = amplitude ?? 1.0;
        program.uniforms.uBlend.value = blend ?? 0.5;
        program.uniforms.uIntensity.value = intensity ?? 1.0;
        const stops = colorStops ?? ['#27FF64', '#7cff67', '#27FF64'];
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        renderer.render({ scene: mesh });
      }
    };
    animateIdRef.current = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateIdRef.current);
      window.removeEventListener('resize', resize);
      if (container && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  };

  const cleanup = () => {
    if (animateIdRef.current) {
      cancelAnimationFrame(animateIdRef.current);
    }
    if (rendererRef.current) {
      const gl = rendererRef.current.gl;
      const container = containerRef.current;
      if (container && gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
    rendererRef.current = null;
  };

  useEffect(() => {
    initAurora();

    return () => {
      cleanup();
    };
  }, [amplitude, intensity, colorStops, blend, speed]);

  return (
    <div ref={containerRef} className={className} style={style}>
      <style jsx>{`
        div {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }

        canvas {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default Aurora;