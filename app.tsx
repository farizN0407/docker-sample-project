import { useState, useEffect } from 'react';
import { WeeklySummary } from './components/WeeklySummary';
import { Timer } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  type: 'studying' | 'break' | 'procrastination';
  duration: number;
}

export default function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Timer className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl">Weekly Summary</h1>
          </div>
          <p className="text-gray-600">View your weekly study, break, and procrastination summary</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Weekly Summary Section */}
          <div>
            <WeeklySummary entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
}