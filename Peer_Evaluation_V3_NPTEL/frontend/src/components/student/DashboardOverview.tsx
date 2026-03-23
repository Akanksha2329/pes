import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface DashboardOverviewProps {
  darkMode: boolean;
  onNavigate: (menu: 'courses' | 'peerEvaluation' | 'viewMarks') => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ darkMode, onNavigate }) => {
  const { data: exams = [], isLoading: examsLoading } = useQuery({
    queryKey: ['upcomingExams'],
    queryFn: async () => {
      const { data } = await api.get('/api/student/exams');
      return data?.exams || [];
    },
  });

  const { data: evaluations = [], isLoading: evalsLoading } = useQuery({
    queryKey: ['pendingEvaluations'],
    queryFn: async () => {
      const { data } = await api.get('/api/student/pending-evaluations');
      return data?.evaluations || data?.evaluatees || [];
    },
  });

  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['evaluationResults'],
    queryFn: async () => {
      const { data } = await api.get('/api/student/results');
      return data?.results || [];
    },
  });

  const palette = darkMode ? {
    background: '#16213E',
    card: '#1A1A2E',
    text: '#E0E0E0',
    muted: '#B0BEC5',
    border: '#3F51B5',
    shadow: 'rgba(0, 0, 0, 0.4)',
  } : {
    background: '#FFFBF6',
    card: '#FFFAF2',
    text: '#4B0082',
    muted: '#A9A9A9',
    border: '#F0E6EF',
    shadow: 'rgba(128, 0, 128, 0.08)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: palette.card,
    borderColor: palette.border,
    color: palette.text,
    boxShadow: `0 4px 20px ${palette.shadow}`,
  };

  const cardBeforeGradient = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';

  const parsedAverages = results
    .map((r: any) => Number(r?.averageMarks))
    .filter((n: number) => Number.isFinite(n));

  const overallAverage =
    parsedAverages.length > 0
      ? (parsedAverages.reduce((sum: number, val: number) => sum + val, 0) / parsedAverages.length).toFixed(2)
      : null;

  const statsLoading = examsLoading || evalsLoading || resultsLoading;
  const upcomingPreview = [...exams]
    .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 2);
  const remainingUpcomingCount = Math.max(exams.length - upcomingPreview.length, 0);
  const recentGradesPreview = results.slice(0, 2);

  const getUrgency = (startTime: string) => {
    const now = new Date();
    const examDate = new Date(startTime);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
    const diffDays = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return {
        label: "Today",
        style: darkMode
          ? { backgroundColor: "#7f1d1d", color: "#fecaca" }
          : { backgroundColor: "#fee2e2", color: "#991b1b" },
      };
    }
    if (diffDays === 1) {
      return {
        label: "Tomorrow",
        style: darkMode
          ? { backgroundColor: "#78350f", color: "#fde68a" }
          : { backgroundColor: "#fef3c7", color: "#92400e" },
      };
    }
    if (diffDays <= 3) {
      return {
        label: `In ${diffDays} days`,
        style: darkMode
          ? { backgroundColor: "#1e3a8a", color: "#bfdbfe" }
          : { backgroundColor: "#dbeafe", color: "#1e40af" },
      };
    }
    return {
      label: `In ${diffDays} days`,
      style: darkMode
        ? { backgroundColor: "#3f3f46", color: "#e4e4e7" }
        : { backgroundColor: "#f4f4f5", color: "#3f3f46" },
    };
  };

  return (
    <div className="space-y-6 relative z-10">
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-1">
        <div className="rounded-2xl p-5 border" style={cardStyle}>
          <p className="text-sm uppercase tracking-wide" style={{ color: palette.muted }}>Upcoming Exams</p>
          <p className="text-3xl font-bold mt-2" style={{ color: palette.text }}>
            {statsLoading ? "..." : exams.length}
          </p>
        </div>
        <div className="rounded-2xl p-5 border" style={cardStyle}>
          <p className="text-sm uppercase tracking-wide" style={{ color: palette.muted }}>Pending Reviews</p>
          <p className="text-3xl font-bold mt-2" style={{ color: palette.text }}>
            {statsLoading ? "..." : evaluations.length}
          </p>
        </div>
        <div className="rounded-2xl p-5 border" style={cardStyle}>
          <p className="text-sm uppercase tracking-wide" style={{ color: palette.muted }}>Average Score</p>
          <p className="text-3xl font-bold mt-2" style={{ color: palette.text }}>
            {statsLoading ? "..." : overallAverage ?? "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-fill-minmax-300 gap-8 sm:grid-cols-1 sm:gap-5">
      {/* Upcoming Exams */}
      <div className="rounded-2xl p-8 border relative overflow-hidden transition-all duration-300 sm:p-5" style={cardStyle}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cardBeforeGradient }}></div>
        <h3 className="mb-4 text-xl font-bold tracking-tight" style={{ color: palette.text }}>Upcoming Exams</h3>
        {examsLoading ? (
          <p style={{ color: palette.muted }}>Loading...</p>
        ) : upcomingPreview.length === 0 ? (
          <p style={{ color: palette.muted }}>No upcoming exams</p>
        ) : (
          <>
            <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed" style={{ color: palette.muted }}>
              {upcomingPreview.map((exam: any) => {
                const urgency = getUrgency(exam.startTime);
                return (
                  <li key={exam._id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>{exam.title}</span>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={urgency.style}
                      >
                        {urgency.label}
                      </span>
                    </div>
                    <span className="text-sm">{new Date(exam.startTime).toLocaleString()}</span>
                  </li>
                );
              })}
            </ul>
            {remainingUpcomingCount > 0 && (
              <p className="mt-2 text-sm italic" style={{ color: palette.muted }}>
                +{remainingUpcomingCount} more
              </p>
            )}
          </>
        )}
        <button
          onClick={() => onNavigate('courses')}
          className="mt-5 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#667eea', color: '#ffffff' }}
        >
          Open Courses
        </button>
      </div>

      {/* Peer Evaluations */}
      <div className="rounded-2xl p-8 border relative overflow-hidden transition-all duration-300 sm:p-5" style={cardStyle}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cardBeforeGradient }}></div>
        <h3 className="mb-4 text-xl font-bold tracking-tight" style={{ color: palette.text }}>Peer Evaluations</h3>
        {evalsLoading ? (
          <p style={{ color: palette.muted }}>Loading...</p>
        ) : evaluations.length === 0 ? (
          <p style={{ color: palette.muted }}>No pending evaluations right now.</p>
        ) : (
          <p style={{ color: palette.muted }}>You have pending evaluations. Complete them to keep grading on schedule.</p>
        )}
        <button
          onClick={() => onNavigate('peerEvaluation')}
          className="mt-5 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#764ba2', color: '#ffffff' }}
        >
          Start Evaluating
        </button>
      </div>

      {/* Recent Grades */}
      <div className="rounded-2xl p-8 border relative overflow-hidden transition-all duration-300 sm:p-5" style={cardStyle}>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cardBeforeGradient }}></div>
        <h3 className="mb-4 text-xl font-bold tracking-tight" style={{ color: palette.text }}>Recent Grades</h3>
        {resultsLoading ? (
          <p style={{ color: palette.muted }}>Loading...</p>
        ) : recentGradesPreview.length === 0 ? (
          <p style={{ color: palette.muted }}>No evaluation results available.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed" style={{ color: palette.muted }}>
            {recentGradesPreview.map((r: any) => (
              <li key={r.exam._id}>
                {r.exam.courseName}: <span style={{ color: palette.text, fontWeight: 600 }}>{r.averageMarks}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => onNavigate('viewMarks')}
          className="mt-5 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: '#667eea', color: '#ffffff' }}
        >
          View Marks
        </button>
      </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
