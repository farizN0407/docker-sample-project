import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TimeEntry {
  id: string;
  date: string;
  type: 'studying' | 'break' | 'procrastination';
  duration: number;
}

interface WeeklySummaryProps {
  entries: TimeEntry[];
}

export function WeeklySummary({ entries }: WeeklySummaryProps) {
  const weekData = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const weekEntries = entries.filter(entry => weekDates.includes(entry.date));

    const summary = {
      studying: 0,
      break: 0,
      procrastination: 0,
    };

    const dailyBreakdown = weekDates.map(date => {
      const dayEntries = weekEntries.filter(entry => entry.date === date);
      return {
        date,
        studying: dayEntries.filter(e => e.type === 'studying').reduce((sum, e) => sum + e.duration, 0),
        break: dayEntries.filter(e => e.type === 'break').reduce((sum, e) => sum + e.duration, 0),
        procrastination: dayEntries.filter(e => e.type === 'procrastination').reduce((sum, e) => sum + e.duration, 0),
      };
    });

    weekEntries.forEach(entry => {
      summary[entry.type] += entry.duration;
    });

    return { summary, dailyBreakdown, weekDates };
  }, [entries]);

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className="space-y-6">
      {/* Weekly Totals */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg">Weekly Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Total Studying</div>
            <div className="text-2xl text-blue-700">{formatMinutes(weekData.summary.studying)}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="text-sm text-green-600 mb-1">Total Break</div>
            <div className="text-2xl text-green-700">{formatMinutes(weekData.summary.break)}</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
            <div className="text-sm text-orange-600 mb-1">Total Procrastination</div>
            <div className="text-2xl text-orange-700">{formatMinutes(weekData.summary.procrastination)}</div>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg">Daily Breakdown</h3>
        </div>
        
        <div className="space-y-3">
          {weekData.dailyBreakdown.map((day) => {
            const total = day.studying + day.break + day.procrastination;
            const today = isToday(day.date);
            
            return (
              <div 
                key={day.date} 
                className={`p-4 rounded-lg border ${
                  today ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${today ? 'text-blue-700' : 'text-gray-700'}`}>
                    {formatDate(day.date)}
                    {today && <span className="ml-2 text-xs text-blue-600">(Today)</span>}
                  </span>
                  <span className="text-gray-600">{formatMinutes(total)}</span>
                </div>
                
                {total > 0 && (
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-blue-600">Study: </span>
                      <span className="text-gray-700">{formatMinutes(day.studying)}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Break: </span>
                      <span className="text-gray-700">{formatMinutes(day.break)}</span>
                    </div>
                    <div>
                      <span className="text-orange-600">Procr.: </span>
                      <span className="text-gray-700">{formatMinutes(day.procrastination)}</span>
                    </div>
                  </div>
                )}
                
                {total === 0 && (
                  <div className="text-sm text-gray-400">No activities logged</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
