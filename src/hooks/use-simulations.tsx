
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, SimulationData, SimulationConfig } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useSimulations() {
  const queryClient = useQueryClient();
  
  // Fetch all simulations
  const { 
    data: simulations, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as SimulationData[];
    }
  });

  // Save a new simulation
  const saveSimulation = useMutation({
    mutationFn: async (simulation: Omit<SimulationData, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('simulations')
        .insert([simulation])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({
        title: "Success",
        description: "Simulation saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save simulation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update an existing simulation
  const updateSimulation = useMutation({
    mutationFn: async (simulation: SimulationData) => {
      const { data, error } = await supabase
        .from('simulations')
        .update(simulation)
        .eq('id', simulation.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({
        title: "Success",
        description: "Simulation updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update simulation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete a simulation
  const deleteSimulation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('simulations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({
        title: "Success",
        description: "Simulation deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete simulation: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Load a specific simulation by ID
  const getSimulationById = async (id: string) => {
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as SimulationData;
  };

  return {
    simulations,
    isLoading,
    error,
    saveSimulation,
    updateSimulation,
    deleteSimulation,
    getSimulationById
  };
}
