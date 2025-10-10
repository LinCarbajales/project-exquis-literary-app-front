import api from '../api'; // axios preconfigurado con token

const userService = {
  getCurrentUser: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },
  updateUser: async (data) => {
    const res = await api.put('/users/me', data);
    return res.data;
  },
  deleteAccount: async () => {
    await api.delete('/users/me');
  },
};

export default userService;
