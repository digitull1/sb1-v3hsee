import { motion } from 'framer-motion';
import { Award, Flame, Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Logo } from '../branding/Logo';

export function Header() {
  const { user } = useStore();

  if (!user) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl shadow-sm"
            >
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-800">Level {user.level}</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl shadow-sm"
            >
              <Star className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-800">{user.points}</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-xl shadow-sm"
            >
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-800">{user.streak} days</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}