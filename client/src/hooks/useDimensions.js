import { useState, useEffect } from 'react';

/**
 * useDimensions Hook - A custom React hook that returns the current dimensions (width and height) of the window.
 *
 * @function
 * @example
 * const { width, height } = useDimensions();
 *
 * @returns {Object} dimensions - An object containing the current width and height of the window.
 * @returns {number} dimensions.width - The current width of the window.
 * @returns {number} dimensions.height - The current height of the window.
 */
const getDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

const useDimensions = () => {
  const [dimensions, setDimensions] = useState(getDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

export default useDimensions;