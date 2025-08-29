import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function GradesForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/grades/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/grades', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['grades']);
      toast.success(id ? 'Grade updated' : 'Grade created');
      navigate('/grades');
    },
    onError: (error) => toast.error(error.message),
  });

  if (!['admin', 'teacher'].includes(role)) return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Grade</h1>
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
          <label className="block">Subject ID</label>
          <input
            {...register('subject_id', { required: true })}
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
          <label className="block">Score</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            {...register('score', { required: true, valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Comments</label>
          <textarea
            {...register('comments')}
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
