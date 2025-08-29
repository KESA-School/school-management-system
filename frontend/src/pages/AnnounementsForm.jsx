import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function AnnouncementsForm() {
  const { id } = useParams();
  const { role, user } = useStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data) =>
      id
        ? fetchWrapper(`/announcements/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data, created_by: user.id }),
          })
        : fetchWrapper('/announcements', {
            method: 'POST',
            body: JSON.stringify({ ...data, created_by: user.id }),
          }),
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      toast.success(id ? 'Announcement updated' : 'Announcement created');
      navigate('/announcements');
    },
    onError: (error) => toast.error(error.message),
  });

  if (!['admin', 'teacher'].includes(role)) return <div>Unauthorized</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl mb-4">{id ? 'Edit' : 'Add'} Announcement</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">Title</label>
          <input
            {...register('title', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Content</label>
          <textarea
            {...register('content', { required: true })}
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
