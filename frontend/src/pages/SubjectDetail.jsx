import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';

export default function SubjectDetail() {
  const { id } = useParams();
  const { data: subject, isLoading } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => fetchWrapper(`/subjects/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">{subject.name}</h1>
    </div>
  );
}
