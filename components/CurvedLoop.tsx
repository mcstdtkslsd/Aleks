"use client"

import React, { useEffect, useRef, useState } from 'react';

interface CurvedLoopProps {
  marqueeText: string;
  speed?: number;
  curveAmount?: number;
  interactive?: boolean;
}

const CurvedLoop = ({
  marqueeText,
  speed = 2,
  curveAmount = 400,
  interactive = true,
}: CurvedLoopProps) => {
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [vel, setVel] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left'); // ✅ 新增 state

  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, []);

  useEffect(() => {
    let animationFrame: number | null = null;

    const animate = () => {
      if (!spacing || !textPathRef.current) return;

      const step = () => {
        if (!dragging && textPathRef.current) {
          const delta = direction === 'right' ? speed : -speed;
          let newOffset = offset + delta;

          const wrapPoint = spacing;
          if (newOffset <= -wrapPoint) newOffset += wrapPoint;
          if (newOffset >= wrapPoint) newOffset -= wrapPoint;

          textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
          setOffset(newOffset);
        }
        animationFrame = requestAnimationFrame(step);
      };
      step();

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
      };
    };

    animate();
  }, [spacing, offset, dragging, direction, speed]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    setDragging(true);
    setLastX(e.clientX);
    setVel(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interactive || !dragging || !textPathRef.current) return;
    const dx = e.clientX - lastX;
    setLastX(e.clientX);
    setVel(dx);

    let newOffset = offset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset >= wrapPoint) newOffset -= wrapPoint;

    textPathRef.current.setAttribute('startOffset', `${newOffset}px`);
    setOffset(newOffset);
  };

  const handlePointerUp = () => {
    if (!interactive) return;
    setDragging(false);
    setDirection(vel > 0 ? 'right' : 'left'); // ✅ 使用内部 state
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center w-full"
      style={{
        visibility: spacing > 0 ? 'visible' : 'hidden',
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <svg
        className="select-none w-full overflow-visible block aspect-[100/12] text-[6rem] font-bold uppercase leading-none"
        viewBox="0 0 1440 120"
      >
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {marqueeText}
        </text>

        <defs>
          <path ref={pathRef} id={`curve-${Math.random().toString(36).substr(2, 9)}`} d={pathD} fill="none" stroke="transparent" />
        </defs>

        <text className="fill-white">
          <textPath ref={textPathRef} href={`#${pathRef.current?.id}`} startOffset={`${offset}px`} xmlSpace="preserve">
            {Array(Math.ceil(1800 / spacing) + 2)
              .fill(marqueeText)
              .join('')}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedLoop;
