import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';

export default function StudentDetail() {
  const { id } = useParams();
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => fetchWrapper(`/students/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">
        {student.first_name} {student.last_name}
      </h1>
      <p>Date of Birth: {student.date_of_birth || 'N/A'}</p>
      <p>Class ID: {student.class_id || 'N/A'}</p>
      <p>Parent ID: {student.parent_id || 'N/A'}</p>
    </div>
  );
}
