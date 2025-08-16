import React, { useState } from 'react';
import LandingPage from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Elyx Dashboard!</h1>
            <p className="text-xl text-gray-600">You've successfully logged in.</p>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Back to Landing Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;