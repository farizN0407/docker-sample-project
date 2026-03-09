import { useState, useEffect } from 'react';
import { TimeTracker } from './components/TimeTracker';
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

  const handleEntriesChange = (newEntries: TimeEntry[]) => {
    setEntries(newEntries);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Timer className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl">Time Tracker</h1>
          </div>
          <p className="text-gray-600">Track your studying, breaks, and procrastination time</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Time Tracker Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl mb-4">Log Your Time</h2>
            <TimeTracker onEntriesChange={handleEntriesChange} />
          </div>

          {/* Weekly Summary Section */}
          <div>
            <WeeklySummary entries={entries} />
          </div>
        </div>
      </div>
    </div>
  );
}
