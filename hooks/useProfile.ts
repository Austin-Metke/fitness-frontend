import { useState, useEffect } from 'react';
import { getProfile } from '@/db/profile';
import { useSession } from './ctx';
import type { Profile } from '@/types/profile';

const useProfile = () => {
  const { session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getProfile(session)
      .then((res) => setProfile(res ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session]);

  return { profile, loading };
};

export default useProfile;
