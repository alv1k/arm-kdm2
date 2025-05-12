import React from 'react';

const Skeleton = ({ 
  width, 
  height, 
  className = '', 
  rounded = 'md', 
  animation = 'pulse' 
}) => {
  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  const animationClass = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
  }[animation];

  return (
    <div
      className={`bg-gray-200 ${roundedClass} ${animationClass} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
    />
  );
};

export default Skeleton;

// SkeletonText.jsx
export const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={i === lines - 1 ? '16px' : '20px'} 
          width={i === lines - 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  );
};

// SkeletonCard.jsx
export const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg p-4">
    <Skeleton height="120px" className="mb-4" rounded="lg" />
    <SkeletonText lines={3} />
    <div className="mt-4 flex space-x-2">
      <Skeleton width="60px" height="32px" rounded="full" />
      <Skeleton width="80px" height="32px" rounded="full" />
    </div>
  </div>
);