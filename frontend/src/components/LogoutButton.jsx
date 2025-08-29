import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import fetchWrapper from '../lib/api';
import supabase from '../lib/supabase';
import useStore from '../store';

export default function LogoutButton() {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => fetchWrapper('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="p-2 bg-red-500 text-white rounded"
    >
      Logout
    </button>
  );
}
