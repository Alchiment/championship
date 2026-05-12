export interface HttpOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export class HttpFacade {
  async request<T>(url: string, options: HttpOptions = {}): Promise<T> {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      // For debug, delete later 
      console.log(await response.json())
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "GET", headers });
  }

  async post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "POST", headers, body });
  }

  async put<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "PUT", headers, body });
  }

  async patch<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "PATCH", headers, body });
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(url, { method: "DELETE", headers });
  }
}

export const httpFacade = new HttpFacade();
