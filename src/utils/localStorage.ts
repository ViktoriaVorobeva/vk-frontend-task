import { LocalStorageState } from "../types";

export const initialSettings: LocalStorageState = {
  names: {},
};

const saveResultInLocalStorage = (key: string, data: LocalStorageState) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const getResultFromLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);

  if (value !== null) {
    try {
      return JSON.parse(value) as LocalStorageState;
    } catch {
      return initialSettings;
    }
  }
  return initialSettings;
};

export { saveResultInLocalStorage, getResultFromLocalStorage };