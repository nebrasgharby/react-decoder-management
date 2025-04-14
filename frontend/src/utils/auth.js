export const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      // In a real app, you would verify the token with the server
      // This is a simplified version
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('token');
        return null;
      }
      
      const data = await response.json();
      return { user: data.user };
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  };
  // utils/auth.js
  export const decodeToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  export const logout = () => {
    localStorage.removeItem('token');
  };