import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  async function refreshProfile() {
    const { data } = await api.get("/profile/me");
    setProfile(data.profile);
    return data.profile;
  }
  async function refreshBlocks() {
    const { data } = await api.get("/blocks");
    setBlocks(data.blocks);
    return data.blocks;
  }
  useEffect(() => {
    async function loadDashboard() {
      try {
        await Promise.all([refreshProfile(), refreshBlocks()]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);
  const value = useMemo(
    () => ({
      profile,
      setProfile,
      blocks,
      setBlocks,
      loading,
      refreshProfile,
      refreshBlocks,
    }),
    [profile, blocks, loading],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
}
