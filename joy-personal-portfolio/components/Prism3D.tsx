"use client";

import React, { useEffect, useRef } from 'react';

const Prism3D = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = 'rotate',
  glow = 1,
  noise = 0.5,
  transparent = true,
  scale = 5.0, // 增大尺寸
  hueShift = 0,
  colorFrequency = 1,
  timeScale = 0.5
}: {
  height?: number;
  baseWidth?: number;
  animationType?: 'rotate' | 'hover' | '3drotate';
  glow?: number;
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  timeScale?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建顶点数据 - 三脚棱镜（等边三角形）
    const vertices = [
      0, height * scale,   // top
      -baseWidth * scale / 2, -height * scale / 2, // bottom left
      baseWidth * scale / 2, -height * scale / 2  // bottom right
    ];

    // 创建顶点缓冲区
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // 创建着色器程序
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    
    const fragmentShaderSource = `
      precision mediump float;
      uniform vec3 uColor;
      void main() {
        gl_FragColor = vec4(uColor, 1.0);
      }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 获取属性位置
    const positionLocation = gl.getAttribLocation(program, "position");
    const colorLocation = gl.getUniformLocation(program, "uColor");

    // 设置颜色
    const colors = [
      0.5, 0.3, 1.0, // 顶部蓝色
      0.9, 0.3, 0.6, // 左下角粉色
      0.2, 0.5, 1.0  // 右下角蓝色
    ];

    let animationId: number;
    let startTime = Date.now();

    const render = () => {
      const currentTime = (Date.now() - startTime) * 0.001;
      
      if (gl && canvas) {
        const width = canvas.width;
        const height = canvas.height;
        
        gl.viewport(0, 0, width, height);
        
        // 清除画布
        gl.clearColor(0, 0, 0, transparent ? 0 : 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // 使用 WebGL 的颜色设置来模拟渐变效果
        // 设置顶点颜色
        const vertices = [
          0, height * scale,   // top
          -baseWidth * scale / 2, -height * scale / 2, // bottom left
          baseWidth * scale / 2, -height * scale / 2  // bottom right
        ];

        // 旋转三角形
        const angle = currentTime * Math.PI * 2 * timeScale;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        for (let i = 0; i < vertices.length; i += 2) {
          const x = vertices[i];
          const y = vertices[i + 1];
          vertices[i] = x * cos - y * sin;
          vertices[i + 1] = x * sin + y * cos;
        }

        // 绑定顶点缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        // 使用统一变量设置颜色
        gl.useProgram(program);
        gl.uniform3f(colorLocation, colors[0], colors[1], colors[2]);
        
        // 启用顶点属性
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
        // 绘制三角形
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      
      animationId = requestAnimationFrame(render);
    };

    // 添加样式
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [height, baseWidth, animationType, glow, noise, transparent, scale, hueShift, colorFrequency, timeScale]);

  // 辅助函数：创建着色器
  function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Failed to create shader');
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error('Failed to compile shader');
    }
    
    return shader;
  }

  // 辅助函数：创建程序
  function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Failed to link program');
    }
    
    return program;
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
      style={{
        filter: `blur(${20 * glow}px)`,
        opacity: transparent ? 0.7 : 1
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default Prism3D;