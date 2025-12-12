import Constants from 'expo-constants';

export const env = {
  BACKEND_URL: Constants.expoConfig?.extra?.backendUrl as string,
};