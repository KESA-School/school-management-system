import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';

export default function ClassDetail() {
  const { id } = useParams();
  const { data: cls, isLoading } = useQuery({
    queryKey: ['class', id],
    queryFn: () => fetchWrapper(`/classes/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">{cls.name}</h1>
      <p>Teacher ID: {cls.teacher_id || 'N/A'}</p>
    </div>
  );
}
