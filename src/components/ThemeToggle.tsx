import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ scale: theme === 'light' ? 1 : 0, opacity: theme === 'light' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
    </Button>
  );
}
