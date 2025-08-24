import { useState, useCallback, useEffect } from 'react';
import {
  addReaction,
  deleteReaction,
  getPublicationReactions,
  getUserReaction
} from '../../services/api';

export function useReactions(publicationId) {
  const [reactions, setReactions] = useState([]);
  const [counts, setCounts] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicationReactions(publicationId);
      if (!res.error) {
        setReactions(res.data.reactions || []);
        setCounts(res.data.counts || {});
        setUserReaction(res.data.userReaction || null);
      } else {
        setError(res);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  useEffect(() => {
    fetchReactions();
  }, [publicationId]);

  const handleAddReaction = useCallback(async (type) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addReaction(publicationId, { type });
      if (!res.error) {
        await fetchReactions();
      } else {
        setError(res);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [publicationId, fetchReactions]);

  const handleRemoveReaction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteReaction(publicationId);
      if (!res.error) {
        await fetchReactions();
      } else {
        setError(res);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [publicationId, fetchReactions]);

  return {
    reactions,
    counts,
    userReaction,
    loading,
    error,
    fetchReactions,
    handleAddReaction,
    handleRemoveReaction
  };
}
