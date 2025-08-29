import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';

export default function TimetableDetail() {
  const { id } = useParams();
  const { data: entry, isLoading } = useQuery({
    queryKey: ['timetables', id],
    queryFn: () => fetchWrapper(`/timetables/${id}`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl mb-4">Timetable Entry</h1>
      <p>Class ID: {entry.class_id}</p>
      <p>Subject ID: {entry.subject_id}</p>
      <p>Teacher ID: {entry.teacher_id}</p>
      <p>Day: {entry.day_of_week}</p>
      <p>
        Time: {entry.start_time} - {entry.end_time}
      </p>
    </div>
  );
}
