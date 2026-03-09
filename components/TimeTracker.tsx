import { useState, useEffect } from 'react';
import { Clock, Play, Pause, Save } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  type: 'studying' | 'break' | 'procrastination';
  duration: number; // in minutes
}

interface TimeTrackerProps {
  onEntriesChange: (entries: TimeEntry[]) => void;
}

export function TimeTracker({ onEntriesChange }: TimeTrackerProps) {
  const [activeType, setActiveType] = useState<'studying' | 'break' | 'procrastination' | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [manualMinutes, setManualMinutes] = useState('');

  useEffect(() => {
    let interval: number | undefined;
    
    if (activeType) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeType]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = (type: 'studying' | 'break' | 'procrastination') => {
    if (activeType) {
      saveEntry();
    }
    setActiveType(type);
    setElapsedSeconds(0);
  };

  const stopTimer = () => {
    if (activeType && elapsedSeconds > 0) {
      saveEntry();
    }
    setActiveType(null);
    setElapsedSeconds(0);
  };

  const saveEntry = () => {
    if (!activeType || elapsedSeconds === 0) return;

    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]') as TimeEntry[];
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: activeType,
      duration: Math.floor(elapsedSeconds / 60),
    };

    if (newEntry.duration > 0) {
      entries.push(newEntry);
      localStorage.setItem('timeEntries', JSON.stringify(entries));
      onEntriesChange(entries);
    }
  };

  const saveManualEntry = (type: 'studying' | 'break' | 'procrastination') => {
    const minutes = parseInt(manualMinutes);
    if (isNaN(minutes) || minutes <= 0) return;

    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]') as TimeEntry[];
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: type,
      duration: minutes,
    };

    entries.push(newEntry);
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    onEntriesChange(entries);
    setManualMinutes('');
  };

  const getButtonClass = (type: 'studying' | 'break' | 'procrastination') => {
    const isActive = activeType === type;
    const baseClass = 'flex-1 p-6 rounded-lg border-2 transition-all duration-200';
    
    const colors = {
      studying: isActive 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50',
      break: isActive 
        ? 'border-green-500 bg-green-50' 
        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50',
      procrastination: isActive 
        ? 'border-orange-500 bg-orange-50' 
        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50',
    };

    return `${baseClass} ${colors[type]}`;
  };

  const typeLabels = {
    studying: { label: 'Studying', color: 'text-blue-600' },
    break: { label: 'Break', color: 'text-green-600' },
    procrastination: { label: 'Procrastination', color: 'text-orange-600' },
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      {activeType && (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className={`text-lg ${typeLabels[activeType].color}`}>
              {typeLabels[activeType].label}
            </span>
          </div>
          <div className="text-4xl font-mono mb-4">{formatTime(elapsedSeconds)}</div>
          <button
            onClick={stopTimer}
            className="flex items-center gap-2 mx-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Pause className="w-4 h-4" />
            Stop & Save
          </button>
        </div>
      )}

      {/* Activity Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(typeLabels) as Array<keyof typeof typeLabels>).map((type) => (
          <div key={type} className={getButtonClass(type)}>
            <div className="text-center mb-4">
              <h3 className={`text-lg mb-1 ${typeLabels[type].color}`}>
                {typeLabels[type].label}
              </h3>
            </div>
            
            <button
              onClick={() => startTimer(type)}
              disabled={activeType === type}
              className="w-full mb-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4" />
              Start Timer
            </button>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              <button
                onClick={() => saveManualEntry(type)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={!manualMinutes}
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
