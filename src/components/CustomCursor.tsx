import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is touch based
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleLinkHover = () => setIsHovering(true);
    const handleLinkLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const checkHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, input, textarea, [data-cursor="hover"]');
      hoverables.forEach((el) => {
        el.addEventListener('mouseenter', handleLinkHover);
        el.addEventListener('mouseleave', handleLinkLeave);
      });
      return hoverables;
    };

    let hoverables = checkHoverables();
    
    // Setup a small observer to re-bind when DOM changes (e.g. modals opening)
    const observer = new MutationObserver(() => {
      // Remove old listeners ideally, but for simple fix we just recheck and add
      // (a better approach scales with event delegation but this works for simple portfolio)
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
      hoverables = checkHoverables();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });
    };
  }, [cursorX, cursorY]);

  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 px-4 py-4 w-8 h-8 rounded-full border-2 border-blue-500/50 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        backgroundColor: isHovering ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: isHovering ? '0px' : '2px',
      }}
      transition={{ duration: 0.2 }}
    />
  );
};
