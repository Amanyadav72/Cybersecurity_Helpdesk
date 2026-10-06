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

export interface SystemStatus {
  neon_database: {
    connected: boolean;
    configured: boolean;
    provider: string;
    env_key: string;
  };
  google_oauth: {
    configured: boolean;
    client_id_set: boolean;
    client_secret_set: boolean;
    client_id_prefix: string;
  };
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

  // Initiate actual Google OAuth 2.0 flow
  initiateGoogleLogin(): void {
    window.location.href = '/auth/google/login';
  },

  // Authenticate via Google ID Token (Google Identity Services / One-Tap)
  async loginWithGoogleToken(credential: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User }>('/auth/google/token', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  // Get status of Neon PostgreSQL and Google OAuth
  async getSystemStatus(): Promise<SystemStatus> {
    return apiRequest<SystemStatus>('/api/system/status');
  },

  // Test live connection to Neon PostgreSQL
  async testNeonDatabase(): Promise<any> {
    return apiRequest<any>('/api/system/test-db');
  },

  // Dynamically configure Google OAuth credentials
  async configureGoogleKeys(client_id: string, client_secret: string): Promise<any> {
    return apiRequest<any>('/api/system/configure-google', {
      method: 'POST',
      body: JSON.stringify({ client_id, client_secret }),
    });
  },

  // Direct login for testing Google-authenticated user directly in Neon DB
  async testGoogleUserLogin(email: string, name: string): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User; message: string }>('/auth/test-google-login', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  // Authenticate user via Google (Neon PostgreSQL persistence)
  async signInWithGoogle(params: {
    email: string;
    name?: string;
    profile_picture?: string;
    google_id?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await apiRequest<{ token: string; user: User; message: string }>('/auth/google-signin', {
      method: 'POST',
      body: JSON.stringify(params),
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

  // Volunteer reply to question
  async respondToQuestion(id: string, response: string): Promise<Question> {
    return apiRequest<Question>(`/api/questions/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },
};
