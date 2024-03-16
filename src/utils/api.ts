export function request<T>(url: string, options= {}): Promise<T> {
  return fetch(url).then((response) => {
    if (!response.ok) {
      return Promise.reject(response);
    }
    return response.json();
  });
}
