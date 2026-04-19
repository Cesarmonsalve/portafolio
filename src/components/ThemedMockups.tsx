'use client';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/config';

// ═══════════════════════════════════════════
// YOUTUBE MOCKUP
// Renders the project image inside a YouTube player interface
// ═══════════════════════════════════════════

export function YouTubeMockup({ project, imageLoaded, onLoad }: { project: Project; imageLoaded: boolean; onLoad: () => void }) {
  return (
    <div className="bg-[#0f0f0f] rounded-xl overflow-hidden border border-white/[0.04]">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {!imageLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={onLoad}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-14 h-10 bg-red-600/90 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21" /></svg>
          </motion.div>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <motion.div
            className="h-full bg-red-600"
            initial={{ width: '0%' }}
            whileInView={{ width: '35%' }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
          />
        </div>
        {/* Time overlay */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
          0:42 / 1:20
        </div>
      </div>

      {/* Video Info */}
      <div className="p-3 flex gap-2.5">
        {/* Channel avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-red to-neon-purple flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
          CM
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[12px] font-medium text-white leading-tight line-clamp-2 mb-0.5">
            {project.title}
          </h4>
          <p className="text-[10px] text-gray-400">CM Design • {project.client || 'CM Design'}</p>
          <p className="text-[10px] text-gray-500">
            {Math.floor(Math.random() * 50 + 10)}K views • {Math.floor(Math.random() * 12 + 1)} months ago
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SPOTIFY MOCKUP
// Renders the project image as a music album/cover
// ═══════════════════════════════════════════

export function SpotifyMockup({ project, imageLoaded, onLoad }: { project: Project; imageLoaded: boolean; onLoad: () => void }) {
  return (
    <div className="bg-gradient-to-b from-[#282828] to-[#121212] rounded-xl overflow-hidden border border-white/[0.04]">
      {/* Album Art */}
      <div className="p-4 pb-3">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={onLoad}
          />
          {/* Floating play button */}
          <motion.div
            className="absolute bottom-3 right-3 w-11 h-11 bg-[#1DB954] rounded-full flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><polygon points="6 3 20 12 6 21" /></svg>
          </motion.div>
        </div>
      </div>

      {/* Track Info */}
      <div className="px-4 pb-2">
        <h4 className="text-[13px] font-bold text-white truncate">{project.title}</h4>
        <p className="text-[11px] text-gray-400 truncate">{project.client || 'CM Design'} • {project.category}</p>
      </div>

      {/* Player controls */}
      <div className="px-4 pb-3">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[8px] text-gray-500 font-mono w-6 text-right">1:23</span>
          <div className="flex-1 h-[3px] bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              whileInView={{ width: '45%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
          <span className="text-[8px] text-gray-500 font-mono w-6">3:28</span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><polygon points="19 20 9 12 19 4" /><line x1="5" y1="19" x2="5" y2="5" stroke="#999" strokeWidth="2" /></svg>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="black"><polygon points="6 3 20 12 6 21" /></svg>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#999"><polygon points="5 4 15 12 5 20" /><line x1="19" y1="5" x2="19" y2="19" stroke="#999" strokeWidth="2" /></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// INSTAGRAM MOCKUP
// Renders the project image as an Instagram post
// ═══════════════════════════════════════════

export function InstagramMockup({ project, imageLoaded, onLoad }: { project: Project; imageLoaded: boolean; onLoad: () => void }) {
  const likes = Math.floor(Math.random() * 3000 + 500);

  return (
    <div className="bg-[#000000] rounded-xl overflow-hidden border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] to-[#962fbf] p-[1.5px]">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[8px] font-bold text-white">
            CM
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-white truncate">cmdesign.studio</p>
          <p className="text-[9px] text-gray-500 truncate">{project.client || 'Original'}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-[#1a1a1a]">
        {!imageLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={project.image}
          alt={project.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={onLoad}
        />
      </div>

      {/* Actions */}
      <div className="px-3 pt-2.5 pb-1.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8, fill: '#ed4956', stroke: '#ed4956' }}
              className="cursor-pointer"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
        </div>

        <p className="text-[11px] font-semibold text-white mb-0.5">{likes.toLocaleString()} likes</p>
        <p className="text-[11px] text-white">
          <span className="font-semibold">cmdesign.studio</span>{' '}
          <span className="text-gray-300">{project.description.slice(0, 80)}...</span>
        </p>
        <p className="text-[10px] text-gray-500 mt-1 uppercase">{Math.floor(Math.random() * 14 + 1)} days ago</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PHONE MOCKUP
// Renders the project image inside a phone frame
// ═══════════════════════════════════════════

export function PhoneMockup({ project, imageLoaded, onLoad }: { project: Project; imageLoaded: boolean; onLoad: () => void }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative w-[220px] mx-auto">
        {/* Phone frame */}
        <div className="relative rounded-[32px] border-[3px] border-gray-700 bg-black p-1 shadow-2xl shadow-black/50">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[18px] bg-black rounded-b-2xl z-20" />
          {/* Status bar */}
          <div className="relative rounded-[28px] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-1">
              <span className="text-[8px] text-white font-semibold">9:41</span>
              <div className="flex items-center gap-0.5">
                <div className="w-3 h-1.5 border border-white rounded-sm"><div className="w-1.5 h-full bg-white rounded-sm" /></div>
              </div>
            </div>
            {/* Screen content */}
            <div className="aspect-[9/19.5] bg-[#1a1a1a] relative">
              {!imageLoaded && <div className="absolute inset-0 shimmer" />}
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={onLoad}
              />
              {/* App overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
                <h4 className="text-[10px] font-bold text-white">{project.title}</h4>
                <p className="text-[8px] text-gray-400 mt-0.5">{project.category}</p>
              </div>
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-white/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
