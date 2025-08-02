// app/shared/services/http.service.ts
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions extends RequestInit {
  method: HttpMethod;
  data?: any;
  params?: Record<string, any>;
  baseURL?: string;
}

interface HttpService {
  get: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "data">
  ) => Promise<T>;
  post: <T>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, "method" | "data">
  ) => Promise<T>;
  put: <T>(
    endpoint: string,
    data: any,
    options?: Omit<RequestOptions, "method" | "data">
  ) => Promise<T>;
  patch: <T>(
    endpoint: string,
    data: any,
    options?: Omit<RequestOptions, "method" | "data">
  ) => Promise<T>;
  delete: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "data">
  ) => Promise<T>;
}

const createHttpService = (defaultBaseURL?: string): HttpService => {
  const buildUrl = (
    endpoint: string,
    params?: Record<string, any>,
    baseURL?: string
  ): string => {
    const base = baseURL || defaultBaseURL || window.location.origin;
    let url: URL;

    try {
      // Check if endpoint is already a full URL
      url = new URL(endpoint);
    } catch {
      // Endpoint is relative, combine with base
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
      url = new URL(cleanEndpoint, base);
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  };

  const request = async <T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> => {
    const { params, data, baseURL, ...restOptions } = options;
    const url = buildUrl(endpoint, params, baseURL);

    const headers = new Headers(restOptions.headers);

    // Add common headers
    headers.set("Accept", "application/json");

    if (data && !headers.has("Content-Type") && !(data instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    let body: string | FormData | undefined;
    if (data) {
      body = data instanceof FormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body,
      });

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      const contentType = response.headers.get("content-type");
      if (response.status === 204 || !contentType) {
        return {} as T;
      }

      return contentType.includes("application/json")
        ? await response.json()
        : ((await response.text()) as T);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      // Network or other errors
      throw new HttpError(
        error instanceof Error ? error.message : "Network error",
        0,
        error
      );
    }
  };

  const handleErrorResponse = async (response: Response): Promise<never> => {
    let errorMessage = response.statusText || "An error occurred";
    let errorData: any;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        errorData = await response.json();
        errorMessage =
          errorData.error_message ||
          errorData.message ||
          errorData.error ||
          errorMessage;
      } else {
        errorMessage = (await response.text()) || errorMessage;
      }
    } catch (parseError) {
      console.warn("Failed to parse error response:", parseError);
    }

    throw new HttpError(errorMessage, response.status, errorData);
  };

  return {
    get: <T>(
      endpoint: string,
      options?: Omit<RequestOptions, "method" | "data">
    ) => request<T>(endpoint, { method: "GET", ...options }),

    post: <T>(
      endpoint: string,
      data?: any,
      options?: Omit<RequestOptions, "method" | "data">
    ) => request<T>(endpoint, { method: "POST", data, ...options }),

    put: <T>(
      endpoint: string,
      data: any,
      options?: Omit<RequestOptions, "method" | "data">
    ) => request<T>(endpoint, { method: "PUT", data, ...options }),

    patch: <T>(
      endpoint: string,
      data: any,
      options?: Omit<RequestOptions, "method" | "data">
    ) => request<T>(endpoint, { method: "PATCH", data, ...options }),

    delete: <T>(
      endpoint: string,
      options?: Omit<RequestOptions, "method" | "data">
    ) => request<T>(endpoint, { method: "DELETE", ...options }),
  };
};

// Create API clients for different services
export const ApiClient = createHttpService();
