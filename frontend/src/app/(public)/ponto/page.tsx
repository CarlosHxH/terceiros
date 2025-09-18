"use client"
import React, { useState } from 'react';

const PrototypovalDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login
    if (username && password) {
      setLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Deshbrcar</h1>
          {loggedIn ? (
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => setActiveSection('login')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loggedIn && activeSection === 'login' ? (
          // Login Section
          <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8">
              <h3 className="font-medium text-lg mb-4">Les Login</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-500">✓</span>
                  </div>
                  <span>Time Clock</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <span className="text-blue-500">✓</span>
                  </div>
                  <span>Inn Out</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  {['Navigation', 'Material UI', 'Material UI'].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2 h-4 w-4 text-blue-500 rounded" 
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Dashboard Content
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Material Utilities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Material Utility</h2>
              
              {/* Material Utility Cards */}
              {[
                { 
                  title: "Material Utility", 
                  description: "Sposable to install premium",
                  code: "C:\\nxnzar"
                },
                { 
                  title: "Material Utility", 
                  description: "Consolidate text generation",
                  code: "CarUs"
                },
                { 
                  title: "Material Utility", 
                  description: "Smartelli Virtual Proxider",
                  code: "Sutd'lenv"
                }
              ].map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-lg mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    {card.code}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Test Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Test</h2>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-blue-50 rounded-md">
                    <span className="font-medium">Patsch</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-md">
                    <span className="font-medium">Calumtree</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Pestoicing</h2>
                <p className="text-gray-600 mb-4">
                  Tomorrow's camera, oilcommodating pick to rainwater! I'm that!
                </p>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Cape the</h3>
                  <div className="flex items-center p-3 bg-green-50 rounded-md">
                    <span className="font-medium">Chen Omman</span>
                  </div>
                </div>
              </div>

              {/* Response Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Response</h2>
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Les Login</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      Time Clock
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      Inn Out
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {['Navigation', 'Material UI', 'Material UI'].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-5 h-5 rounded border border-gray-300 mr-2 flex items-center justify-center">
                          <div className="w-3 h-3 rounded bg-blue-500 hidden"></div>
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Deshbrcar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrototypovalDashboard;