import { motion } from 'framer-motion';
import { Download, Palette, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ImagePreviewProps {
  imageUrl: string;
  isColoring?: boolean;
  isLoading?: boolean;
  onDownload: () => void;
  onCreateColoring?: () => void;
}

export function ImagePreview({
  imageUrl,
  isColoring,
  isLoading,
  onDownload,
  onCreateColoring,
}: ImagePreviewProps) {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <img
          src={imageUrl}
          alt={isColoring ? "Coloring sheet" : "Generated artwork"}
          className={cn(
            "w-full rounded-lg shadow-lg transition-all duration-200",
            "group-hover:shadow-xl",
            isColoring && "bg-white"
          )}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDownload}
          className={cn(
            "rounded-full p-2",
            "bg-gradient-to-r from-blue-500 to-indigo-500",
            "text-white shadow-md hover:shadow-lg",
            "transition-all duration-200"
          )}
        >
          <Download className="w-5 h-5" />
        </motion.button>

        {!isColoring && onCreateColoring && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateColoring}
            className={cn(
              "rounded-full p-2",
              "bg-gradient-to-r from-purple-500 to-pink-500",
              "text-white shadow-md hover:shadow-lg",
              "transition-all duration-200"
            )}
          >
            <Palette className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}