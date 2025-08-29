import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function StudentForm() {
  const { id } = useParams();
  const { role } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
          })
        : fetchWrapper('/students', {
            method: 'POST',
            body: JSON.stringify(data),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
      toast.success(id ? 'Student updated' : 'Student created');
      navigate('/students');
    },
    onError: (error) => alert(error.message),
  });

  if (role !== 'admin') return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Student</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">First Name</label>
          <input
            {...register('first_name', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Last Name</label>
          <input
            {...register('last_name', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Date of Birth</label>
          <input
            type="date"
            {...register('date_of_birth')}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Class ID</label>
          <input
            {...register('class_id')}
            className="w-full p-2 border rounded"
            placeholder="UUID (optional)"
          />
        </div>
        <div>
          <label className="block">Parent ID</label>
          <input
            {...register('parent_id')}
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
