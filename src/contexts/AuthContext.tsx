import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, authHelpers, MoodEntry, UserProfile, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  moodEntries: Record<string, MoodEntry>;
  saveMoodEntry: (entry: Omit<MoodEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  syncMoodEntries: () => Promise<void>;
  userProfile: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<Record<string, MoodEntry>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, running in offline mode');
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // Load user data when signed in
          await loadUserData(session.user.id);
        } else {
          // Clear user data when signed out
          setMoodEntries({});
          setUserProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load mood entries
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (moodError) {
        console.error('Error loading mood entries:', moodError);
      } else {
        // Convert array to object keyed by date
        const entriesObj: Record<string, MoodEntry> = {};
        moodData?.forEach(entry => {
          entriesObj[entry.date] = entry;
        });
        setMoodEntries(entriesObj);
      }

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading user profile:', profileError);
      } else {
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }
    const result = await authHelpers.signUp(email, password, fullName);
    return result;
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured. Please set up your environment variables.');
    }
    const result = await authHelpers.signIn(email, password);
    return result;
  };

  const signOut = async () => {
    try {
      // Clear local state first
      setMoodEntries({});
      setUserProfile(null);
      
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, clearing local state only');
        return { error: null };
      }
      
      // Sign out from Supabase
      const result = await authHelpers.signOut();
      
      if (result.error) {
        console.error('Sign out error:', result.error);
        throw result.error;
      }
      
      return result;
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const result = await authHelpers.resetPassword(email);
    return result;
  };

  const saveMoodEntry = async (entry: Omit<MoodEntry, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('No user found when trying to save mood entry');
      throw new Error('User not authenticated');
    }

    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, saving to local state only');
      // Create a mock entry for local state
      const mockEntry = {
        ...entry,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setMoodEntries(prev => ({
        ...prev,
        [entry.date]: mockEntry,
      }));
      return;
    }

    try {
      console.log('Saving mood entry:', entry);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .upsert({
          ...entry,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error saving mood entry:', error);
        throw error;
      }

      console.log('Mood entry saved successfully:', data);

      // Update local state
      setMoodEntries(prev => ({
        ...prev,
        [entry.date]: data,
      }));
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  };

  const deleteMoodEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting mood entry:', error);
        throw error;
      }

      // Update local state
      setMoodEntries(prev => {
        const newEntries = { ...prev };
        Object.keys(newEntries).forEach(date => {
          if (newEntries[date].id === id) {
            delete newEntries[date];
          }
        });
        return newEntries;
      });
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      throw error;
    }
  };

  const syncMoodEntries = async () => {
    if (!user) return;
    await loadUserData(user.id);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    moodEntries,
    saveMoodEntry,
    deleteMoodEntry,
    syncMoodEntries,
    userProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
