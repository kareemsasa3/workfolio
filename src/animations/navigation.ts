export const navItemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200,
    },
  },
};

export const navIconVariants = {
  hover: {
    scale: 1.1,
    y: -5,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
    },
  },
  tap: {
    scale: 0.95,
  },
};
