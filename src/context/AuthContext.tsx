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
  const [userTier, setUserTierState] = useState<UserTier>('subscribed');
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [paywallFeatureName, setPaywallFeatureName] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserTierState('subscribed');
      localStorage.setItem('unbox_user_tier', 'subscribed');
    }
  }, []);

  const setUserTier = (tier: UserTier) => {
    setUserTierState('subscribed');
    if (typeof window !== 'undefined') {
      localStorage.setItem('unbox_user_tier', 'subscribed');
    }
  };

  const triggerPaywall = (_featureName: string) => {
    // Paid feature disabled; all features are 100% unlocked for all users.
  };

  return (
    <AuthContext.Provider
      value={{
        userTier: 'subscribed',
        setUserTier,
        showPaywallModal: false,
        setShowPaywallModal,
        paywallFeatureName: '',
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
