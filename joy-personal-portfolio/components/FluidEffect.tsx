"use client"

import React, { useEffect, useRef } from 'react';

const FluidEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    isMoving: false,
    movementX: 0,
    movementY: 0
  });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 鼠标事件处理
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // 计算鼠标移动距离
      mouseRef.current.movementX = e.clientX - lastMousePos.current.x;
      mouseRef.current.movementY = e.clientY - lastMousePos.current.y;
      
      // 只有当鼠标移动足够距离时才标记为移动
      if (Math.abs(mouseRef.current.movementX) > 0.5 || Math.abs(mouseRef.current.movementY) > 0.5) {
        mouseRef.current.isMoving = true;
        lastMousePos.current.x = e.clientX;
        lastMousePos.current.y = e.clientY;
      }
    };

    const handleMouseStop = () => {
      // 延迟一小段时间后标记为停止移动
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseStop);

    // 流体点系统
    const fluidPoints: FluidPoint[] = [];
    class FluidPoint {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      decay: number;

      constructor(x: number, y: number, movementX: number, movementY: number) {
        this.x = x;
        this.y = y;
        // 根据鼠标移动速度调整初始速度
        this.speedX = movementX * 0.2 + (Math.random() - 0.5) * 2;
        this.speedY = movementY * 0.2 + (Math.random() - 0.5) * 2;
        // 降低颜色饱和度，使用更柔和的颜色
        const hue = Math.random() * 360;
        const saturation = 30 + Math.random() * 20; // 30-50% 饱和度
        const lightness = 40 + Math.random() * 20; // 40-60% 亮度
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.size = 5 + Math.random() * 15;
        this.life = 100;
        this.decay = 0.92 + Math.random() * 0.05; // 衰减速度
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98; // 摩擦力
        this.speedY *= 0.98;
        this.size *= this.decay;
        this.life--;
      }

      draw() {
        if (!ctx) return;
        const alpha = this.life / 100;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 创建流体点
    const createFluidPoints = (x: number, y: number, movementX: number, movementY: number) => {
      // 根据鼠标移动速度决定创建点的数量
      const speed = Math.sqrt(movementX * movementX + movementY * movementY);
      const count = Math.min(3, Math.max(1, Math.floor(speed / 10)));
      
      for (let i = 0; i < count; i++) {
        fluidPoints.push(new FluidPoint(x, y, movementX, movementY));
      }
    };

    // 动画循环
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;

      // 限制帧率以减少性能消耗
      if (timestamp - lastTime.current < 16) { // ~60fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime.current = timestamp;

      // 半透明背景覆盖，创建晕染效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 如果鼠标正在移动，创建新流体点
      if (mouseRef.current.isMoving) {
        createFluidPoints(
          mouseRef.current.x, 
          mouseRef.current.y,
          mouseRef.current.movementX,
          mouseRef.current.movementY
        );
      }

      // 更新和绘制流体点
      for (let i = 0; i < fluidPoints.length; i++) {
        fluidPoints[i].update();
        fluidPoints[i].draw();

        // 移除生命结束的点
        if (fluidPoints[i].life <= 0 || fluidPoints[i].size <= 0.5) {
          fluidPoints.splice(i, 1);
          i--;
        }
      }

      // 重置移动状态
      mouseRef.current.isMoving = false;
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画
    animationRef.current = requestAnimationFrame(animate);

    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseStop);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};

export default FluidEffect;