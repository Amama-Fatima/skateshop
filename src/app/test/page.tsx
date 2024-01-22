"use client"

import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>> | undefined;
}

const MyComponent: React.FC<MyComponentProps> = ({ count = 1, setCount }) => {
  const [someOtherCount, setSomeOtherCount] = useState<number>(0);

  const handleCountUpdate = (newCount: number) => {
    // Check if setCount is defined before calling it
    if (setCount) {
      setCount(newCount);
    }

    setSomeOtherCount(newCount);
  };

  useEffect(() => {
    console.log('count updated', count);
  }, [count]);

  useEffect(() => {
    console.log('someOtherCount updated', someOtherCount);
  }, [someOtherCount]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => handleCountUpdate(someOtherCount + 1)}>
        Increment Count
      </button>
    </div>
  );
};

export default MyComponent;

