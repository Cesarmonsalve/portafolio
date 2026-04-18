'use client';
import { motion } from 'framer-motion';

const skills = [
  { name: 'After Effects', level: 95, icon: '🎬' },
  { name: 'Cinema 4D', level: 80, icon: '🧊' },
  { name: 'Photoshop', level: 92, icon: '🖼️' },
  { name: 'Illustrator', level: 85, icon: '✏️' },
  { name: 'Premiere Pro', level: 88, icon: '🎥' },
  { name: 'DaVinci Resolve', level: 75, icon: '🎨' },
  { name: 'Blender', level: 70, icon: '🔮' },
  { name: 'Figma', level: 78, icon: '📐' },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-purple text-sm font-bold tracking-[0.3em] uppercase">Herramientas</span>
          <h2 className="font-display text-5xl md:text-7xl font-black mt-4">
            MI{' '}
            <span className="text-neon-purple" style={{ textShadow: '0 0 20px #a855f7' }}>
              ARSENAL
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group bg-bg border border-white/5 rounded-xl p-5 hover:border-neon-purple/30 hover:bg-bg-tertiary transition-all duration-300"
            >
              <div className="text-3xl mb-3">{skill.icon}</div>
              <h4 className="font-display font-bold text-sm mb-3">{skill.name}</h4>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 10px rgba(168,85,247,0.5)',
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2 block">{skill.level}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}