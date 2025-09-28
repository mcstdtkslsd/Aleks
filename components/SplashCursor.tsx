// 新增文件：实现飞溅光标效果
"use client"

import React, { useEffect, useRef } from 'react';

const SplashCursor = ({ 
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true
}: {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const isMouseDownRef = useRef(false);
  const animationFrameRef = useRef<number>(0);
  const mouseMovedRef = useRef(false);

  // 抖音风格的颜色调色板
  const colors = [
    { r: 255, g: 100, b: 100 },    // 红色
    { r: 180, g: 100, b: 255 },   // 紫色
    { r: 100, g: 150, b: 255 },    // 深蓝色
    { r: 255, g: 150, b: 200 },  // 粉色
    { r: 150, g: 220, b: 255 },  // 浅蓝色
    { r: 200, g: 150, b: 255 }   // 紫罗兰色
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标移动事件
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // 标记鼠标已移动
      mouseMovedRef.current = true;
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      // 鼠标按下时创建溅射效果
      createSplashEffect(mouseRef.current.x, mouseRef.current.y);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    // 创建溅射效果
    const createSplashEffect = (x: number, y: number) => {
      mouseMovedRef.current = true;
    };

    // 添加事件监听器
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // 简化的飞溅效果实现
    let time = 0;
    const particles: {x: number, y: number, dx: number, dy: number, age: number, maxAge: number, color: {r: number, g: number, b: number}, size: number, baseAlpha: number}[] = [];
    
    // 创建粒子溅射效果
    const createSplat = (x: number, y: number, dx: number, dy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        // 随机选择颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 随机粒子大小，范围从5到15像素
        const size = 5 + Math.random() * 10;
        
        // 添加随机性到速度向量（减慢速度）
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2; // 降低速度
        const randomDx = Math.cos(angle) * speed + dx * 0.3; // 降低鼠标影响因子
        const randomDy = Math.sin(angle) * speed + dy * 0.3; // 降低鼠标影响因子
        
        // 随机基础透明度，提高整体透明度
        const baseAlpha = 0.7 + Math.random() * 0.3;
        
        particles.push({
          x: x,
          y: y,
          dx: randomDx,
          dy: randomDy,
          age: 0,
          maxAge: 30 + Math.random() * 40,
          color: color,
          size: size,
          baseAlpha: baseAlpha
        });
      }
    };
    
    const draw = () => {
      const { width, height } = canvas;
      time += 0.016; // 假设60fps
      
      // 清除画布
      if (TRANSPARENT) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = `rgba(${BACK_COLOR.r * 255}, ${BACK_COLOR.g * 255}, ${BACK_COLOR.b * 255}, 0.1)`;
        ctx.fillRect(0, 0, width, height);
      }
      
      // 当鼠标移动时创建粒子
      if (mouseMovedRef.current) {
        const dx = mouseRef.current.x - mouseRef.current.prevX;
        const dy = mouseRef.current.y - mouseRef.current.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        // 根据速度创建不同数量的粒子和溅射效果
        const particleCount = Math.min(8, Math.max(1, Math.floor(speed / 5)));
        createSplat(mouseRef.current.x, mouseRef.current.y, dx, dy, particleCount);
        
        mouseMovedRef.current = false;
      }
      
      // 更新和绘制粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        
        // 更新位置
        p.x += p.dx;
        p.y += p.dy;
        
        // 添加重力和摩擦力
        p.dx *= 0.97; // 稍微减少摩擦力
        p.dy *= 0.97; // 稍微减少摩擦力
        p.dy += 0.15; // 稍微减少重力
        
        // 计算透明度（基于随机基础透明度）
        const alpha = p.baseAlpha * (1 - (p.age / p.maxAge));
        
        // 绘制粒子，使用粒子自身的大小
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.size * (1 - p.age / p.maxAge)), 0, Math.PI * 2);
        
        // 应用模糊效果和发光效果
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.shadowBlur = 15; // 添加模糊效果
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
        ctx.fill();
        
        // 重置阴影效果，避免影响其他元素
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // 移除过期粒子
        if (p.age > p.maxAge) {
          particles.splice(i, 1);
        }
      }
      
      // 当鼠标按下时绘制更大的圆
      if (isMouseDownRef.current) {
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, SPLAT_RADIUS * 100, 0, Math.PI * 2);
        // 添加模糊和发光效果
        ctx.shadowColor = 'rgba(255, 100, 100, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(255, 100, 100, 0.2)';
        ctx.fill();
        // 重置阴影效果
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }
      
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    
    // 初始化鼠标位置
    const initMousePosition = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
    };
    
    window.addEventListener('mousemove', initMousePosition);
    draw();

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', initMousePosition);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [SPLAT_RADIUS, SPLAT_FORCE, BACK_COLOR, TRANSPARENT]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

export default SplashCursor;