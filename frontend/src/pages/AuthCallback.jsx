import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import useStore from '../store';

export default function AuthCallback() {
  const setUser = useStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        alert('Authentication failed');
        navigate('/login');
        return;
      }
      setUser(data.session.user, data.session);
      navigate('/dashboard');
    });
  }, [navigate, setUser]);

  return <div>Loading...</div>;
}
