import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function ReportCard() {
  const { student_id } = useParams();
  const { role } = useStore();
  const { data: grades, isLoading } = useQuery({
    queryKey: ['report', student_id],
    queryFn: () => fetchWrapper(`/grades/report/${student_id}`),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!['admin', 'teacher', 'student', 'parent'].includes(role))
    return <div>Unauthorized</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Report Card</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Score</th>
            <th className="border p-2">Comments</th>
          </tr>
        </thead>
        <tbody>
          {grades?.map((grade) => (
            <tr key={grade.id}>
              <td className="border p-2">
                {grade.subjects?.name || grade.subject_id}
              </td>
              <td className="border p-2">{grade.score}</td>
              <td className="border p-2">{grade.comments || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
