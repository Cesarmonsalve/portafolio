'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getSkills, type Skill } from '@/lib/config';

const defaultSkills: Skill[] = [
  { id: '1', name: 'After Effects', level: 95, icon: '🎬', category: 'Video', position: 0 },
  { id: '2', name: 'Cinema 4D', level: 80, icon: '🧊', category: '3D', position: 1 },
  { id: '3', name: 'Photoshop', level: 92, icon: '🖼️', category: 'Diseño', position: 2 },
  { id: '4', name: 'Illustrator', level: 85, icon: '✏️', category: 'Diseño', position: 3 },
  { id: '5', name: 'Premiere Pro', level: 88, icon: '🎥', category: 'Video', position: 4 },
  { id: '6', name: 'DaVinci Resolve', level: 75, icon: '🎨', category: 'Video', position: 5 },
  { id: '7', name: 'Blender', level: 70, icon: '🔮', category: '3D', position: 6 },
  { id: '8', name: 'Figma', level: 78, icon: '📐', category: 'Diseño', position: 7 },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);

  useEffect(() => {
    getSkills().then((data) => {
      if (data.length > 0) setSkills(data);
    });
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-label text-neon-purple">Herramientas</span>
          <h2 className="text-heading text-3xl md:text-4xl mt-3">
            Mi{' '}
            <span className="text-neon-purple" style={{ textShadow: '0 0 15px rgba(168,85,247,0.3)' }}>
              Arsenal
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-bg border border-white/[0.04] rounded-xl p-4 hover:border-neon-purple/20 hover:bg-bg-tertiary transition-all duration-300"
              data-cursor-hover
            >
              <div className="text-2xl mb-2">{skill.icon}</div>
              <h4 className="text-subheading text-xs mb-2.5">{skill.name}</h4>
              <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.08 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-600 mt-1.5 block">{skill.level}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}