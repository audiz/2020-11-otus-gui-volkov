import Lockr from 'lockr';
Lockr.prefix = 'authinfo';

export const getAuthInfo = () => Lockr.get('obj', {});
export const setAuthInfo = obj => Lockr.set('obj', obj);