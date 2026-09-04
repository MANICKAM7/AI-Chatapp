
// base url contain a backend render url for deploye//
const BASE_URL = 'https://ai-chatapp-2.onrender.com/api';

/**
 * Universal API request wrapper
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        // Token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error ${endpoint}]:`, error.message);
    throw error;
  }
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, avatar) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, avatar }),
    }),

  getMe: () => request('/auth/me'),
};

export const chatAPI = {
  sendMessage: (message, conversationId = null) =>
    request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    }),

  getConversations: () => request('/chat/conversations'),

  getConversationById: (id) => request(`/chat/conversations/${id}`),

  createConversation: (title = 'New Chat') =>
    request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  updateConversationTitle: (id, title) =>
    request(`/chat/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    }),

  deleteConversation: (id) =>
    request(`/chat/conversations/${id}`, {
      method: 'DELETE',
    }),
};

export const userAPI = {
  getProfile: () => request('/users/profile'),

  updateProfile: (name, avatar) =>
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, avatar }),
    }),

  changePassword: (currentPassword, newPassword) =>
    request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};
