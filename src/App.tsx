import React, { useState } from 'react';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className='text-red-500'>React TypeScript Counter</h1>
      <p>Count: {count}</p>
      <button onClick={decrement} style={{ marginRight: '10px' }}>
        -
      </button>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default App;
