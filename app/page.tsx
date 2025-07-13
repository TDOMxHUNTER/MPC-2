'use client';
import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import SearchAndLeaderboard from './SearchAndLeaderboard';
import { saveProfile } from './utils/profileStorage';
import { SecurityManager } from './utils/security';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "MONAD",
    title: "Currently Testnet",
    handle: "monad_xyz",
    status: "Online",
    avatarUrl: "https://docs.monad.xyz/img/monad_logo.png"
  });

  // Clear all saved data on mount - run only once
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('dataCleared');
    if (!hasCleared) {
      localStorage.removeItem('profileData');
      localStorage.removeItem('profileSearchCounts');
      localStorage.removeItem('userProfiles');
      localStorage.removeItem('savedAvatars');
      localStorage.removeItem('profileSettings');
      sessionStorage.setItem('dataCleared', 'true');
    }
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize security
    if (typeof window !== 'undefined') {
      SecurityManager.getInstance();
      
      // Load saved profile data
      try {
        const savedProfileData = localStorage.getItem('currentProfileData');
        if (savedProfileData) {
          const parsed = JSON.parse(savedProfileData);
          setProfileData(parsed);
        }
      } catch (error) {
        console.warn('Failed to load saved profile data:', error);
      }
    }
  }, []);

  const handleProfileSelect = (profile: any) => {
    setProfileData({
      name: profile.name,
      title: profile.title,
      handle: profile.handle,
      status: profile.status || "Online",
      avatarUrl: profile.avatarUrl
    });
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    const newProfileData = {
      name: updatedProfile.name,
      title: updatedProfile.title,
      handle: updatedProfile.handle,
      status: updatedProfile.status || "Online",
      avatarUrl: updatedProfile.avatarUrl
    };

    setProfileData(newProfileData);

    try {
      // Get existing profiles to preserve search count
      const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
      const existingProfile = profiles.find((p: any) => p.handle === updatedProfile.handle);
      
      saveProfile({
        name: updatedProfile.name,
        title: updatedProfile.title,
        handle: updatedProfile.handle,
        avatarUrl: updatedProfile.avatarUrl,
        status: updatedProfile.status || "Online",
        searchCount: existingProfile ? existingProfile.searchCount : 0
      });

      // Also save the current profile data separately
      localStorage.setItem('currentProfileData', JSON.stringify(newProfileData));
    } catch (error) {
      console.warn('Failed to save profile:', error);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8"
          style={{ 
            background: '#000000',
            minHeight: '100vh',
            height: '100%',
            width: '100%',
            position: 'relative',
            paddingTop: '2rem'
          }}>

      

      {/* Search and Leaderboard */}
      <div className="search-leaderboard-container" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
        <SearchAndLeaderboard onProfileSelect={handleProfileSelect} />
      </div>

      {/* Floating Monad Logo - Above heading */}
      <div className="floating-monad">
        <img 
          src="https://docs.monad.xyz/img/monad_logo.png" 
          alt="Monad Logo" 
          className="monad-logo"
        />
      </div>

      {/* Main Heading */}
      <div className="text-center mb-8 px-4">
        <h1 className="monad-heading text-4xl md:text-6xl font-bold text-white mb-4 tracking-wider">
          MONAD PROFILE CARD
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Create and customize your unique Monad profile card with holographic effects
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <ProfileCard
          avatarUrl={profileData.avatarUrl}
          name={profileData.name}
          title={profileData.title}
          handle={profileData.handle}
          status={profileData.status}
          onProfileUpdate={handleProfileUpdate}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onContactClick={() => {
            window.open(`https://x.com/${profileData.handle}`, '_blank');
          }}
        />
      </div>
    </main>
  );
}