import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function ClassForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/classes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/classes', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['classes']);
      toast.success(id ? 'Class updated' : 'Class created');
      navigate('/classes');
    },
    onError: (error) => toast.error(error.message),
  });

  if (role !== 'admin') return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Class</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Teacher ID</label>
          <input
            {...register('teacher_id')}
            className="w-full p-2 border rounded"
            placeholder="UUID (optional)"
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
