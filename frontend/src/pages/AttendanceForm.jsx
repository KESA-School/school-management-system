import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function AttendanceForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/attendance/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/attendance', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      toast.success(id ? 'Attendance updated' : 'Attendance created');
      navigate('/attendance');
    },
    onError: (error) => toast.error(error.message),
  });

  if (!['admin', 'teacher'].includes(role)) return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Attendance</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">Student ID</label>
          <input
            {...register('student_id', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="UUID"
          />
        </div>
        <div>
          <label className="block">Class ID</label>
          <input
            {...register('class_id', { required: true })}
            className="w-full p-2 border rounded"
            placeholder="UUID"
          />
        </div>
        <div>
          <label className="block">Date</label>
          <input
            type="date"
            {...register('date', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Status</label>
          <select
            {...register('status', { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
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
