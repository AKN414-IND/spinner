import React from 'react';
import './Spinner.css'; 

const Spinner = ({ isSpinning, onSpinEnd }) => {
  const spinnerRef = React.useRef(null);

  React.useEffect(() => {
    if (isSpinning && spinnerRef.current) {
      const spinDuration = 3; 
      const randomDegree = Math.floor(360 + Math.random() * 1440);
      const handleTransitionEnd = () => {
        if (onSpinEnd) onSpinEnd();
      };

      const wheel = spinnerRef.current;
      wheel.style.transition = `transform ${spinDuration}s ease-out`;
      wheel.style.transform = `rotate(${randomDegree}deg)`;

      wheel.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        wheel.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [isSpinning, onSpinEnd]);

  return (
    <div className="spinner" ref={spinnerRef}>
    </div>
  );
};

export default Spinner;
