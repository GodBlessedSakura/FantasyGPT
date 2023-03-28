export const getTokens = () => {
  const jwt = localStorage.getItem('FantasyGPT');

  return jwt;
};

export const clearTokens = () => {
  localStorage.removeItem('FantasyGPT');
};

export const setTokens = (jwt) => {
  localStorage.setItem('FantasyGPT', jwt);
};
