import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';
import toast from 'react-hot-toast';

export default function SubjectForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/subjects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/subjects', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      toast.success(id ? 'Subject updated' : 'Subject created');
      navigate('/subjects');
    },
    onError: (error) => toast.error(error.message),
  });

  if (role !== 'admin') return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Subject</h1>
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
