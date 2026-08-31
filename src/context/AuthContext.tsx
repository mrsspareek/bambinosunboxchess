'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserTier = 'free' | 'subscribed';

interface AuthContextType {
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  showPaywallModal: boolean;
  setShowPaywallModal: (show: boolean) => void;
  paywallFeatureName: string;
  triggerPaywall: (featureName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userTier, setUserTierState] = useState<UserTier>('subscribed'); // Default subscribed for full demo, toggleable to free
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallFeatureName, setPaywallFeatureName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unbox_user_tier') as UserTier;
      if (stored) {
        setUserTierState(stored);
      }
    }
  }, []);

  const setUserTier = (tier: UserTier) => {
    setUserTierState(tier);
    if (typeof window !== 'undefined') {
      localStorage.setItem('unbox_user_tier', tier);
    }
  };

  const triggerPaywall = (featureName: string) => {
    setPaywallFeatureName(featureName);
    setShowPaywallModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        userTier,
        setUserTier,
        showPaywallModal,
        setShowPaywallModal,
        paywallFeatureName,
        triggerPaywall
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
