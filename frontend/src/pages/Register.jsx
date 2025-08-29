import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import useStore from '../store';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) =>
      fetchWrapper('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setUser(data.user);
      navigate('/dashboard');
    },
    onError: (error) => alert(error.message),
  });

  return (
    <div className="max-w-md mx-auto mt-10">
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Role</label>
          <select
            {...register('role', { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
