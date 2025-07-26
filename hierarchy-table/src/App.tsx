import React, { useState, useEffect } from 'react';
import { HierarchyItem } from './types';
import HierarchyTable from './components/HierarchyTable';
import { dataService } from './services/dataService';

function App() {
  const [data, setData] = useState<HierarchyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedData = await dataService.loadData();
        setData(loadedData);
      } catch (err) {
        setError('Failed to load data. Please check if example-data.json is available.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-300">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-teal-primary rounded-full animate-spin mb-5"></div>
          <p>Loading hierarchy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg text-white font-sans">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-red-500">
          <h2 className="text-2xl font-semibold mb-5">Error</h2>
          <p className="text-gray-300 max-w-md mb-5">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-teal-primary hover:bg-teal-hover text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-primary focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <header className="bg-dark-surface px-5 py-5 text-center border-b border-gray-700">
        <h1 className="text-4xl font-semibold text-teal-primary mb-2">Hierarchy Table</h1>
        <p className="text-gray-300">Click on rows with children to expand/collapse. Use the red X to remove items.</p>
      </header>
      <main className="p-5">
        <HierarchyTable data={data} />
      </main>
    </div>
  );
}

export default App;
