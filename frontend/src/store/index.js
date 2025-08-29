import { create } from 'zustand';
import supabase from '../lib/supabase';

const useStore = create((set) => ({
  user: null,
  role: null,
  setUser: async (user, session) => {
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      set({ user, role: data?.role });
    } else {
      set({ user: null, role: null });
    }
  },
}));

export default useStore;
