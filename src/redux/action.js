// src/redux/actions.js
export const SET_EMAIL = 'SET_EMAIL';
export const LOGOUT = 'LOGOUT';

export const setEmail = (email) => ({
  type: SET_EMAIL,
  payload: email,
});

export const logout = () => ({
  type: LOGOUT,
});

