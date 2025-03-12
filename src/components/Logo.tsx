
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded bg-hr-blue text-white font-semibold">
        HR
      </div>
      <span className="font-semibold text-lg">EasyHR</span>
    </div>
  );
};

export default Logo;
