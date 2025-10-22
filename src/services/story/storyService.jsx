import api from './api';

export const assignStory = async () => {
  const response = await api.post('/stories/assign');
  return response.data;
};

export const unlockStory = async (storyId) => {
  const response = await api.post(`/stories/unlock/${storyId}`);
  return response.data;
};

export const getUserStories = async () => {
  const response = await api.get('/stories/mine');
  return response.data;
};
