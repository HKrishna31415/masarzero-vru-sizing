import React from 'react';

interface MasarZeroLogoProps {
  /** Height in px — width scales proportionally (original is 1826×1030, ~1.77:1) */
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * MasarZero brand logo — uses the official PNG from /public/masarzerologo.png.
 * The PNG is RGBA with a transparent background.
 */
export const MasarZeroLogo: React.FC<MasarZeroLogoProps> = ({
  height = 40,
  className = '',
  style,
}) => {
  // Original dimensions: 1826 × 1030
  const width = Math.round(height * (1826 / 1030));

  return (
    <img
      src="/masarzerologo.png"
      alt="MasarZero"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block', objectFit: 'contain', ...style }}
      draggable={false}
    />
  );
};
