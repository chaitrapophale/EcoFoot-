import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivingFootprintProps {
  percentage: number; // 0 to 100
  interactive?: boolean;
  onTapPollution?: (layerName: string) => void;
}

export const LivingFootprint: React.FC<LivingFootprintProps> = ({
  percentage,
  interactive = false,
  onTapPollution
}) => {
  // Determine opacity/scale of each layer based on completion percentage
  // 1. Smoke (clears from 0% to 20%)
  const smokeOpacity = Math.max(0, 1 - percentage / 20);
  
  // 2. Garbage/Plastic (fades from 15% to 40%)
  const garbageOpacity = percentage < 15 ? 1 : Math.max(0, 1 - (percentage - 15) / 25);
  
  // 3. Oil stains (fades from 30% to 55%)
  const oilOpacity = percentage < 30 ? 1 : Math.max(0, 1 - (percentage - 30) / 25);
  
  // 4. Mud (fades from 45% to 70%)
  const mudOpacity = percentage < 45 ? 1 : Math.max(0, 1 - (percentage - 45) / 25);
  
  // 5. Cracks in earth (heal from 55% to 80%)
  const cracksOpacity = percentage < 55 ? 1 : Math.max(0, 1 - (percentage - 55) / 25);
  
  // 6. Moss (restores from 50% to 75%)
  const mossOpacity = percentage < 50 ? 0 : Math.min(1, (percentage - 50) / 25);
  
  // 7. Grass (grows from 60% to 85%)
  const grassProgress = percentage < 60 ? 0 : Math.min(1, (percentage - 60) / 25);
  
  // 8. Flowers (bloom from 70% to 90%)
  const flowersProgress = percentage < 70 ? 0 : Math.min(1, (percentage - 70) / 20);
  
  // 9. Tree (sprouts from 80% to 100%)
  const treeProgress = percentage < 80 ? 0 : Math.min(1, (percentage - 80) / 20);
  
  // 10. Butterflies (appear from 85% to 100%)
  const butterflyOpacity = percentage < 85 ? 0 : Math.min(1, (percentage - 85) / 15);
  
  // 11. Birds (appear from 90% to 100%)
  const birdsOpacity = percentage < 90 ? 0 : Math.min(1, (percentage - 90) / 10);
  
  // 12. Sunlight ray (brightens from 80% to 100%)
  const sunlightOpacity = percentage < 80 ? 0.1 : 0.1 + (Math.min(1, (percentage - 80) / 20) * 0.4);

  // SVG Paths for Toes
  const toes = [
    { id: 'toe1', cx: 125, cy: 50, rx: 16, ry: 20, rotate: -5, label: 'Big Toe' },
    { id: 'toe2', cx: 155, cy: 52, rx: 10, ry: 13, rotate: 0, label: 'Second Toe' },
    { id: 'toe3', cx: 178, cy: 60, rx: 9, ry: 12, rotate: 3, label: 'Third Toe' },
    { id: 'toe4', cx: 198, cy: 72, rx: 8, ry: 10, rotate: 6, label: 'Fourth Toe' },
    { id: 'toe5', cx: 215, cy: 90, rx: 7, ry: 9, rotate: 10, label: 'Pinky Toe' }
  ];

  // Foot sole path outline
  const solePath = "M 125,85 C 90,120 85,170 85,205 C 85,235 100,260 110,285 C 115,300 110,320 105,340 C 100,360 100,380 110,405 C 120,425 150,430 165,415 C 180,400 180,370 175,350 C 170,330 165,310 170,290 C 175,260 200,220 200,180 C 200,140 190,105 160,85 C 145,75 135,75 125,85 Z";

  // Foot combined clip path definition
  const clipPathId = "footprint-clip";

  return (
    <div className="relative w-full max-w-[340px] aspect-[3/4] mx-auto select-none">
      {/* Immersive glow background behind footprint */}
      <div 
        className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent blur-3xl transition-opacity duration-1000"
        style={{ opacity: percentage / 100 }}
      />

      <svg 
        viewBox="0 0 300 450" 
        className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Foot Clip Path so textures map inside the footprint */}
          <clipPath id={clipPathId}>
            <path d={solePath} />
            {toes.map((toe) => (
              <ellipse 
                key={toe.id}
                cx={toe.cx} 
                cy={toe.cy} 
                rx={toe.rx} 
                ry={toe.ry} 
                transform={`rotate(${toe.rotate} ${toe.cx} ${toe.cy})`}
              />
            ))}
          </clipPath>

          {/* Gradients */}
          <linearGradient id="cracked-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c2a29" />
            <stop offset="100%" stopColor="#1e1c1b" />
          </linearGradient>

          <linearGradient id="healthy-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="50%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          <linearGradient id="sunray-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Footprint Base (Always visible, changes color from cracked earth brown to healthy rich green) */}
        <g clipPath={`url(#${clipPathId})`}>
          {/* Default Dark Cracked Soil */}
          <rect width="300" height="450" fill="url(#cracked-grad)" />

          {/* Restored Rich Soil Overlay */}
          <motion.rect 
            width="300" 
            height="450" 
            fill="url(#healthy-grad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: mossOpacity }}
            transition={{ duration: 1.5 }}
          />

          {/* Soil Cracks Layer */}
          <motion.g 
            stroke="#111" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity={cracksOpacity}
            transition={{ duration: 1 }}
          >
            {/* Crack paths */}
            <path d="M 120,130 L 135,160 L 125,200 M 135,160 L 155,150 M 140,250 L 150,270 L 140,300 M 150,270 L 165,280 M 130,360 L 145,380 M 145,380 L 135,395" />
            <path d="M 125,50 L 125,60 M 155,52 L 155,60 M 178,60 L 178,66" />
          </motion.g>

          {/* Mud Patches */}
          <motion.g 
            fill="#3f2e24" 
            opacity={mudOpacity} 
            className={interactive ? "cursor-pointer" : ""}
            onClick={() => interactive && onTapPollution?.('mud')}
          >
            <path d="M 100,120 Q 120,100 135,125 T 160,110 T 145,150 Z" />
            <path d="M 110,320 Q 130,310 140,335 T 160,350 T 130,380 Z" />
            <ellipse cx="125" cy="50" rx="8" ry="12" fill="#3f2e24" />
          </motion.g>

          {/* Oil Slicks (purple sheen) */}
          <motion.g 
            fill="#3b2b4c" 
            opacity={oilOpacity} 
            className={interactive ? "cursor-pointer" : ""}
            onClick={() => interactive && onTapPollution?.('oil')}
          >
            <path d="M 140,180 Q 170,170 180,195 T 150,225 T 130,200 Z" opacity="0.6" />
            <path d="M 125,370 Q 145,360 155,380 T 135,400 Z" opacity="0.6" />
          </motion.g>

          {/* Trash & Plastic clutter */}
          <motion.g 
            opacity={garbageOpacity}
            className={interactive ? "cursor-pointer pointer-events-auto" : ""}
            onClick={() => interactive && onTapPollution?.('garbage')}
          >
            {/* Plastic bottle shape */}
            <rect x="150" y="140" width="8" height="18" rx="2" fill="#93c5fd" transform="rotate(45 150 140)" />
            <rect x="153" y="137" width="2" height="4" fill="#1e3a8a" transform="rotate(45 150 140)" />
            {/* Crushed can */}
            <rect x="120" y="340" width="10" height="15" fill="#9ca3af" transform="rotate(-30 120 340)" />
            {/* Crumpled bag */}
            <path d="M 140,290 C 135,290 130,295 132,300 C 130,302 135,308 140,305 C 145,308 148,302 146,300 C 148,295 145,290 140,290 Z" fill="#e5e7eb" />
          </motion.g>

          {/* Soft green moss padding inside */}
          <motion.g 
            fill="#065f46" 
            opacity={mossOpacity}
          >
            <circle cx="120" cy="180" r="25" opacity="0.4" />
            <circle cx="150" cy="360" r="20" opacity="0.4" />
            <circle cx="130" cy="270" r="15" opacity="0.4" />
          </motion.g>
        </g>

        {/* 2. Foliage layers (clip path is NOT used here, so they can sprout outside the footprint for depth) */}
        {/* Healthy Grass Blades (scale up) */}
        <g>
          {grassProgress > 0 && (
            <>
              {/* Heel grass */}
              <motion.path 
                d="M 115,395 Q 112,380 108,375 Q 116,382 120,395" 
                stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, scale: 0 }}
                animate={{ pathLength: grassProgress, scale: grassProgress }}
                transition={{ duration: 1.2 }}
              />
              <motion.path 
                d="M 135,405 Q 138,385 142,380 Q 140,392 135,405" 
                stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, scale: 0 }}
                animate={{ pathLength: grassProgress, scale: grassProgress }}
                transition={{ duration: 1, delay: 0.1 }}
              />
              {/* Ball of the foot grass */}
              <motion.path 
                d="M 105,200 Q 95,180 90,175 Q 102,188 105,200" 
                stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, scale: 0 }}
                animate={{ pathLength: grassProgress, scale: grassProgress }}
                transition={{ duration: 1.1 }}
              />
              <motion.path 
                d="M 180,160 Q 192,145 198,140 Q 188,152 180,160" 
                stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0, scale: 0 }}
                animate={{ pathLength: grassProgress, scale: grassProgress }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </>
          )}
        </g>

        {/* Flowers blooming (grow and rotate) */}
        <g>
          {flowersProgress > 0 && (
            <>
              {/* Flower 1 - Pink (ball of foot) */}
              <motion.g 
                transform="translate(110, 160)"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: flowersProgress, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
              >
                {/* Stem */}
                <path d="M 0,20 Q -5,10 -2,0" stroke="#047857" strokeWidth="2" fill="none" />
                {/* Petals */}
                <circle cx="-2" cy="-4" r="5" fill="#f472b6" />
                <circle cx="4" cy="0" r="5" fill="#f472b6" />
                <circle cx="-2" cy="4" r="5" fill="#f472b6" />
                <circle cx="-8" cy="0" r="5" fill="#f472b6" />
                <circle cx="-2" cy="0" r="4" fill="#fef08a" />
              </motion.g>

              {/* Flower 2 - Yellow (arch) */}
              <motion.g 
                transform="translate(165, 270)"
                initial={{ scale: 0, rotate: 45 }}
                animate={{ scale: flowersProgress, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 90, damping: 10, delay: 0.15 }}
              >
                <path d="M 0,15 Q 5,8 2,0" stroke="#047857" strokeWidth="1.5" fill="none" />
                <circle cx="2" cy="-3" r="4" fill="#fbbf24" />
                <circle cx="7" cy="0" r="4" fill="#fbbf24" />
                <circle cx="2" cy="3" r="4" fill="#fbbf24" />
                <circle cx="-3" cy="0" r="4" fill="#fbbf24" />
                <circle cx="2" cy="0" r="3" fill="#fff" />
              </motion.g>

              {/* Flower 3 - Blue (heel) */}
              <motion.g 
                transform="translate(145, 380)"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: flowersProgress, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 110, damping: 10, delay: 0.3 }}
              >
                <path d="M 0,15 Q -2,6 0,0" stroke="#047857" strokeWidth="1.5" fill="none" />
                <circle cx="0" cy="-4" r="4" fill="#60a5fa" />
                <circle cx="5" cy="-1" r="4" fill="#60a5fa" />
                <circle cx="3" cy="3" r="4" fill="#60a5fa" />
                <circle cx="-3" cy="3" r="4" fill="#60a5fa" />
                <circle cx="-5" cy="-1" r="4" fill="#60a5fa" />
                <circle cx="0" cy="0" r="2.5" fill="#fde047" />
              </motion.g>
            </>
          )}
        </g>

        {/* 3. The Tree / Sapling sprouting (located in the arch of the foot) */}
        <g>
          {treeProgress > 0 && (
            <motion.g 
              transform="translate(140, 240)"
              initial={{ scale: 0 }}
              animate={{ scale: treeProgress }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            >
              {/* Trunk */}
              <path d="M 0,35 Q 2,20 -2,0" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M -1,15 Q -10,8 -8,0" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 0,10 Q 10,5 8,-2" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              
              {/* Leaves clusters (slowing sways with CSS) */}
              <g className="animate-wind-gentle origin-bottom">
                <circle cx="-2" cy="-5" r="11" fill="#047857" opacity="0.9" />
                <circle cx="-10" cy="0" r="9" fill="#065f46" opacity="0.85" />
                <circle cx="8" cy="-2" r="8" fill="#10b981" opacity="0.9" />
                <circle cx="2" cy="-12" r="8" fill="#34d399" opacity="0.8" />
              </g>
            </motion.g>
          )}
        </g>

        {/* 4. Ambient smog/smoke overlay (inside footprint, fades away) */}
        <g clipPath={`url(#${clipPathId})`}>
          <motion.g opacity={smokeOpacity}>
            <ellipse cx="120" cy="150" rx="35" ry="20" fill="#6b7280" opacity="0.45" />
            <ellipse cx="160" cy="220" rx="40" ry="25" fill="#4b5563" opacity="0.4" />
            <ellipse cx="130" cy="340" rx="30" ry="18" fill="#374151" opacity="0.5" />
          </motion.g>
        </g>

        {/* 5. Restored Butterflies hovering (positioned on the outer rim) */}
        <g>
          {butterflyOpacity > 0 && (
            <>
              {/* Butterfly 1 (resting on toe) */}
              <motion.g 
                transform="translate(130, 30) scale(0.6)"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: butterflyOpacity, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <path d="M0,0 C-3,-5 -10,-5 -8,0 C-10,5 -3,5 0,0 C3,5 10,5 8,0 C10,-5 3,-5 0,0" fill="#f59e0b" className="animate-[wing-flap_0.3s_infinite]" />
              </motion.g>

              {/* Butterfly 2 (floating near tree) */}
              <motion.g 
                transform="translate(170, 210) scale(0.5) rotate(15)"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: butterflyOpacity, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <path d="M0,0 C-3,-5 -10,-5 -8,0 C-10,5 -3,5 0,0 C3,5 10,5 8,0 C10,-5 3,-5 0,0" fill="#10b981" className="animate-[wing-flap_0.25s_infinite]" />
              </motion.g>
            </>
          )}
        </g>

        {/* 6. Birds (sky circling at the top) */}
        <g>
          {birdsOpacity > 0 && (
            <>
              <motion.path 
                d="M 60,60 Q 66,55 72,60 Q 78,55 84,60" 
                stroke="#064e3b" strokeWidth="1.5" strokeLinecap="round" fill="none"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: birdsOpacity, x: 0 }}
                transition={{ duration: 1.5 }}
              />
              <motion.path 
                d="M 220,50 Q 225,46 230,50 Q 235,46 240,50" 
                stroke="#064e3b" strokeWidth="1.2" strokeLinecap="round" fill="none"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: birdsOpacity, x: 0 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
            </>
          )}
        </g>

        {/* 7. Warm sunlight overlay rays */}
        <motion.polygon 
          points="0,0 80,0 220,450 0,450" 
          fill="url(#sunray-grad)" 
          opacity={sunlightOpacity} 
          style={{ mixBlendMode: 'screen' }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      {/* Completion tag floating inside absolute box */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/20 text-xs font-semibold tracking-wider text-emerald-400 flex items-center gap-1.5 shadow-lg shadow-black/40">
        <span className={`w-2 h-2 rounded-full ${percentage >= 80 ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
        <span>{percentage}% RESTORED</span>
      </div>
    </div>
  );
};
