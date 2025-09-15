import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

interface FloatingParticlesProps {
  mood?: string;
  count?: number;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ mood = 'calm', count = 20 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const moodColors = {
    happy: ['#FFD700', '#FFA500', '#FFB347'],
    calm: ['#87CEEB', '#B0E0E6', '#ADD8E6'],
    energetic: ['#FF6347', '#FF7F50', '#FF4500'],
    sad: ['#B0C4DE', '#D3D3D3', '#E6E6FA'],
    excited: ['#DA70D6', '#BA55D3', '#9370DB'],
    peaceful: ['#98FB98', '#90EE90', '#32CD32'],
    anxious: ['#FFD700', '#FFA500', '#FF8C00'],
    grateful: ['#DDA0DD', '#DA70D6', '#9370DB'],
  };

  useEffect(() => {
    const colors = moodColors[mood as keyof typeof moodColors] || moodColors.calm;
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 6,
      });
    }

    setParticles(newParticles);
  }, [mood, count]);

  return (
    <div className="floating-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;