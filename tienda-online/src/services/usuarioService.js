import { supabase } from '../lib/supabaseClient';

export const authService = {
    login: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    logout: async () => {
        await supabase.auth.signOut();
    },

    getCurrentUser: () => {
        return supabase.auth.getUser();
    }
};