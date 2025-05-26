
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HealthProfile {
  id?: string;
  user_id: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active';
  blood_group?: string;
  allergies?: string;
  medications?: string;
  medical_conditions?: string;
  emergency_contact?: string;
  smoking?: boolean;
  alcohol?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WeightRecord {
  id: string;
  weight: number;
  recorded_at: string;
}

export const useHealthProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Type assertion to ensure proper typing
        const typedProfile: HealthProfile = {
          ...data,
          gender: data.gender as 'male' | 'female' | 'other',
          activity_level: data.activity_level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active'
        };
        setProfile(typedProfile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error fetching health profile:', error);
      toast({
        title: "Error",
        description: "Failed to load health profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeightHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true });

      if (error) throw error;
      setWeightHistory(data || []);
    } catch (error) {
      console.error('Error fetching weight history:', error);
    }
  };

  const createProfile = async (profileData: Omit<HealthProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion to ensure proper typing
      const typedProfile: HealthProfile = {
        ...data,
        gender: data.gender as 'male' | 'female' | 'other',
        activity_level: data.activity_level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active'
      };
      setProfile(typedProfile);
      setHasProfile(true);

      // Add initial weight record if weight is provided
      if (profileData.weight) {
        await supabase
          .from('weight_history')
          .insert({
            user_id: user.id,
            weight: profileData.weight
          });
        fetchWeightHistory();
      }

      toast({
        title: "Success",
        description: "Health profile created successfully",
      });

      return true;
    } catch (error) {
      console.error('Error creating health profile:', error);
      toast({
        title: "Error",
        description: "Failed to create health profile",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProfile = async (profileData: Partial<HealthProfile>) => {
    if (!user || !profile) return false;

    try {
      const { data, error } = await supabase
        .from('health_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Type assertion to ensure proper typing
      const typedProfile: HealthProfile = {
        ...data,
        gender: data.gender as 'male' | 'female' | 'other',
        activity_level: data.activity_level as 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'super_active'
      };
      setProfile(typedProfile);

      // Add weight record if weight was updated
      if (profileData.weight && profileData.weight !== profile.weight) {
        await supabase
          .from('weight_history')
          .insert({
            user_id: user.id,
            weight: profileData.weight
          });
        fetchWeightHistory();
      }

      toast({
        title: "Success",
        description: "Health profile updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating health profile:', error);
      toast({
        title: "Error",
        description: "Failed to update health profile",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchWeightHistory();
    }
  }, [user]);

  return {
    profile,
    weightHistory,
    loading,
    hasProfile,
    createProfile,
    updateProfile,
    refetch: () => {
      fetchProfile();
      fetchWeightHistory();
    }
  };
};
