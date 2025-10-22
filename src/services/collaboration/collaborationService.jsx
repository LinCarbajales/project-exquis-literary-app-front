import api from './api';

export const createCollaboration = async (storyId, text) => {
  const response = await api.post('/collaborations', { storyId, text });
  return response.data;
};

export const getPreviousCollaboration = async (storyId) => {
  const response = await api.get(`/collaborations/story/${storyId}/last`);
  return response.data;
};