import { User, Question, DashboardStats, QuestionCategory } from '../types';

const TOKEN_KEY = 'csh_auth_token';
const USER_KEY = 'csh_user_profile';

// Get current token from storage
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearStoredAuth();
    throw new Error('Session expired or unauthorized. Please sign in again.');
  }

  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Check active user session
  async checkAuth(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const user = await apiRequest<User>('/auth/me');
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    } catch {
      clearStoredAuth();
      return null;
    }
  },

  // Initiate real Google OAuth flow
  initiateGoogleLogin(): void {
    window.location.href = '/auth/google/login';
  },

  // Demo Google Login for testing and viva presentation
  async demoLogin(data: { email: string; name: string; picture?: string }): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // continue clearing local storage even if request fails
    } finally {
      clearStoredAuth();
    }
  },

  // Get user dashboard metrics & recent questions
  async getDashboardStats(): Promise<DashboardStats> {
    return apiRequest<DashboardStats>('/api/dashboard/stats');
  },

  // Submit a new cyber safety query
  async submitQuestion(category: QuestionCategory, question: string): Promise<Question> {
    return apiRequest<Question>('/api/questions', {
      method: 'POST',
      body: JSON.stringify({ category, question }),
    });
  },

  // Get only questions submitted by current user
  async getMyQuestions(): Promise<Question[]> {
    return apiRequest<Question[]>('/api/questions');
  },

  // Get question details
  async getQuestion(id: string): Promise<Question> {
    return apiRequest<Question>(`/api/questions/${id}`);
  },

  // Volunteer/Demo reply to question
  async respondToQuestion(id: string, response: string): Promise<Question> {
    return apiRequest<Question>(`/api/questions/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },
};
