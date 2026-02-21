const DEFAULT_API_BASE_URL = 'http://localhost:5000';

const normalizeBaseUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return DEFAULT_API_BASE_URL;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_API_BASE_URL;
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

export const buildApiUrl = (path = '') => {
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${suffix}`;
};

export const apiUrlWithCacheBuster = (path = '') => {
  const url = buildApiUrl(path);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};
