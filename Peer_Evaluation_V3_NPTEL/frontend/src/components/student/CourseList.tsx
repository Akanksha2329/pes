import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

type Course = {
  _id: string;
  name: string;
  code: string;
};

type Props = {
  onSelectCourse: (courseId: string) => void;
  darkMode: boolean;
};

const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await api.get('/api/student/courses');
  return data.courses;
};

const CourseList = ({ onSelectCourse, darkMode }: Props) => {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['studentCourses'],
    queryFn: fetchCourses,
  });

  const cardShadow = `0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.08)`;
  const cardHoverShadow = `0 10px 20px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.12)`;
  const cardBeforeGradient = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
  const buttonBg = 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)';
  const buttonShadow = '0 4px 12px rgba(45, 55, 72, 0.3)';
  const buttonHoverShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';

  const commonCardClasses = `
    ${darkMode ? "bg-[#1A1A2E] text-white border-gray-700" : "bg-white text-gray-900 border-black/10"}
    rounded-2xl p-8 border shadow-[${cardShadow}]
    transition-all duration-300 ease-in-out relative overflow-hidden
    hover:translate-y-[-6px] hover:shadow-[${cardHoverShadow}] hover:border-[rgba(102,126,234,0.2)]
  `;
  const commonCardBeforeClasses = `
    content-[''] absolute top-0 left-0 right-0 h-1
    origin-left scale-x-0 transition-transform duration-300 ease-in
  `;
  const commonButtonClasses = `
    group relative overflow-hidden text-white border-none py-3 px-6 rounded-xl font-semibold
    cursor-pointer text-base transition-all duration-300 ease-in-out
    shadow-[${buttonShadow}]
    hover:translate-y-[-2px] hover:shadow-[${buttonHoverShadow}]
    active:translate-y-0
  `;
  const commonButtonBeforeClasses = `
    content-[''] absolute top-0 left-[-100%] w-full h-full
    bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500
    group-hover:left-full
  `;

  if (isLoading) return <div className={`text-center p-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Loading courses...</div>;
  if (error) return <div className={`text-center p-4 ${darkMode ? "text-red-400" : "text-red-600"}`}>Error loading courses.</div>;

  return (
    <div className="space-y-5 relative z-10">
      <div className={`rounded-2xl p-6 border ${darkMode ? "bg-[#1A1A2E] border-gray-700" : "bg-white border-black/10"}`}>
        <h2 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>My Courses</h2>
        <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Select a course to view upcoming exams and submit answers.
        </p>
      </div>

      <div className="grid grid-cols-fill-minmax-300 gap-8 sm:grid-cols-1 sm:gap-5">
        {courses && courses.map((course) => (
          <div key={course._id} className={commonCardClasses}>
            <div className={commonCardBeforeClasses} style={{ background: cardBeforeGradient }}></div>
            <h3 className="mb-4 text-xl font-bold tracking-tight">{course.name}</h3>
            <p className="text-base leading-relaxed mb-4">{course.code}</p>
            <button
              className={`${commonButtonClasses}`}
              onClick={() => onSelectCourse(course._id)}
              style={{ background: buttonBg }}
            >
              <span className={commonButtonBeforeClasses}></span>
              View Exams
            </button>
          </div>
        ))}
      </div>

      {courses && courses.length === 0 && (
        <div className={`rounded-2xl p-6 border text-center ${darkMode ? "bg-[#1A1A2E] border-gray-700 text-gray-300" : "bg-white border-black/10 text-gray-600"}`}>
          No enrolled courses found.
        </div>
      )}
    </div>
  );
};

export default CourseList;
