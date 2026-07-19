// Grow Decoupling Client Layer
// Fully independent wrapper redirecting traffic to your custom Render server

const API_BASE_URL = 'http://localhost:5000/api';

export const Grow = {
  auth: {
    login: async (email, password) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return data;
      } catch (error) {
        console.error('Authentication request failure:', error);
        return { success: false, error: 'Server connection offline' };
      }
    },
    signup: async (email, password) => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        return await response.json();
      } catch (error) {
        console.error('Registration request failure:', error);
        return { success: false, error: 'Server connection offline' };
      }
    }
  },
  entities: {
    Conversation: {
      list: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/conversations`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) return [];
          return await response.json();
        } catch (error) {
          console.error('Failed to pull custom server records:', error);
          return [];
        }
      },
      update: async (id, payload) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          return await response.json();
        } catch (error) {
          console.error('Failed to push custom server updates:', error);
          return { success: false };
        }
      }
    }
  }
};
