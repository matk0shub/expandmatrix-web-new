'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import type { TeamMember } from '@/hooks/useTeamMembers';

interface TeamCardProps {
  member: TeamMember;
  locale: string;
}

export default function TeamCard({ member, locale }: TeamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role based on locale
  const getRole = () => {
    return member.role[locale as keyof typeof member.role] || member.role.cs;
  };

  return (
    <motion.article
      className="group relative bg-[#0B0B0B] rounded-2xl p-6 md:p-8 text-center cursor-pointer transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03,
        y: -8,
      }}
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Avatar/Portrait */}
      <div className="relative mb-6">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border-2 border-white/10">
          {member.avatar?.url ? (
            <Image
              src={member.avatar.url}
              alt={`${member.name} - ${getRole()}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl md:text-3xl font-bold">
                {getInitials(member.name)}
              </span>
            </div>
          )}
        </div>
        
        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Name */}
      <h3 className="heading-tertiary font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
        {member.name}
      </h3>

      {/* Role/Position */}
      <p className="text-gray-400 text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
        {getRole()}
      </p>

      {/* Subtle glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}
