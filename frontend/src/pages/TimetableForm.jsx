import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function TimetableForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/timetables/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/timetables', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['timetables']);
      toast.success(id ? 'Timetable updated' : 'Timetable created');
      navigate('/timetables');
    },
    onError: (error) => toast.error(error.message),
  });

  if (role !== 'admin') return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Timetable Entry</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">Class ID</label>
          <input
            {...register('class_id', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="UUID"
          />
        </div>
        <div>
          <label className="block">Subject ID</label>
          <input
            {...register('subject_id', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="UUID"
          />
        </div>
        <div>
          <label className="block">Teacher ID</label>
          <input
            {...register('teacher_id', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="UUID"
          />
        </div>
        <div>
          <label className="block">Day of Week</label>
          <select
            {...register('day_of_week', { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div>
          <label className="block">Start Time</label>
          <input
            type="time"
            {...register('start_time', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">End Time</label>
          <input
            type="time"
            {...register('end_time', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
