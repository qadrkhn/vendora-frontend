const API_BASE = "/v1";

const apiRoutes = {
  auth: {
    register: `${API_BASE}/register`,
    login: `${API_BASE}/login`,
    verifyOtp: `${API_BASE}/verify-otp`,
    googleAuth: `${API_BASE}/auth/google`,
    logout: `${API_BASE}/logout`,
    resendOtp: `${API_BASE}/resend-otp`,
    google: `${API_BASE}/google-auth`,
  },
  user: {
    me: `${API_BASE}/me`,
  },
  file: {
    upload: `${API_BASE}/files/upload`,
  },
  category: {
    create: `${API_BASE}/category`,
    get: `${API_BASE}/category/`,
    update: `${API_BASE}/category`,
    delete: `${API_BASE}/category/`,
    list: `${API_BASE}/category`,
  },
};

export default apiRoutes;
