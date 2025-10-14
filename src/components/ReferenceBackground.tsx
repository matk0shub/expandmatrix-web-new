'use client';

import { motion } from 'framer-motion';
import { Reference } from './ReferencesSection';

interface ReferenceBackgroundProps {
  reference: Reference;
  prefersReducedMotion: boolean;
}

export default function ReferenceBackground({
  reference,
  prefersReducedMotion,
}: ReferenceBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{
          backgroundImage: reference.image?.url 
            ? `url(${reference.image.url})` 
            : 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.8,
          ease: 'easeInOut' 
        }}
      />

      {/* Enhanced gradient overlay for better text legibility */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.6,
          delay: prefersReducedMotion ? 0 : 0.2 
        }}
      />
      
      {/* Additional subtle overlay for extra contrast */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 0.8,
          delay: prefersReducedMotion ? 0 : 0.4 
        }}
      />

      {/* Fallback gradient for missing images */}
      {!reference.image?.url && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
        />
      )}

      {/* Subtle pattern overlay */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ 
          duration: prefersReducedMotion ? 0 : 1,
          delay: prefersReducedMotion ? 0 : 0.5 
        }}
      />
    </div>
  );
}
