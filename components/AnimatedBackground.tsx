'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Generate random floating particles (dust/sparks)
    const particles = Array.from({ length: 25 }).map((_, i) => {
        const isCyan = Math.random() > 0.5;
        return {
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 30 + 15, // slower drift
            delay: Math.random() * -30,
            color: isCyan ? 'rgba(0, 243, 255, 0.4)' : 'rgba(176, 38, 255, 0.3)', // Cyan or Purple
        };
    });

    return (
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-dark-bg">
            {/* 1. Base Gradient - Deep dark aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a0c] to-[#050505]" />

            {/* 2. Enhanced Moving Matrix Grid with glowing dots */}
            <motion.div
                animate={{
                    backgroundPosition: ['0px 0px', '40px 40px'],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                className="absolute inset-0 z-0 opacity-20 mix-blend-screen"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.15) 1px, transparent 1px), radial-gradient(circle, rgba(0, 243, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px, 40px 40px, 40px 40px'
                }}
            />
            {/* 2.5 Secondary overlay matrix for depth */}
            <motion.div
                animate={{
                    backgroundPosition: ['0px 0px', '-60px -60px'],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                className="absolute inset-0 z-0 opacity-10 mix-blend-screen"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(176, 38, 255, 0.3) 2px, transparent 2px)',
                    backgroundSize: '60px 60px'
                }}
            />

            {/* 3. Smooth Vignette & Gradient Overlays to add depth (dark edges) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] mix-blend-multiply opacity-90 pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/60 to-[#050505] opacity-90 pointer-events-none" />

            {/* 4. Slow breathing colored ambient glows (like Setup/Game pages) */}
            <motion.div
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-neon-cyan/10"
            />
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[150px] bg-neon-purple/10"
            />

            {/* 5. Floating Ambient Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    animate={{
                        y: ['100vh', '-10vh'],
                        x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
                        opacity: [0, 0.8, 0],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                    className="absolute"
                    style={{
                        left: 0,
                        bottom: '-10vh',
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%', // mix of squares and circles
                    }}
                />
            ))}
        </div>
    );
}
