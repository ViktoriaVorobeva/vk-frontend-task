export interface FormProps {
  id: string;
  setActivePanel: React.Dispatch<React.SetStateAction<string>>;
}

export interface FactRequest {
  fact: string;
  length: number;
}

export interface NameRequest {
  name: string;
  age: number;
  count: number;
}

export interface LocalStorageState {
    names: {
        [key: string]: number;
    }
}
