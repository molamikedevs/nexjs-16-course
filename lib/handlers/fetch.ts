import { ActionResponse } from "@/types/global";
import { RequestError } from "../errors/http-error";

import logger from "../errors/logger";
import handleError from "./error";

export interface FetchOptions extends RequestInit {
  timeout?: number;
}

// Type guard to check if error is an instance of Error
function isError(error: unknown): error is Error {
    return error instanceof Error;
}

// Generic fetch handler with timeout and error handling
export async function fetchHandler<T>(url: string, options: FetchOptions = {}): Promise<ActionResponse<T>> {
    const { timeout = 5000, headers: customHeaders = {}, ...fetchOptions } = options;

    // Abort request after timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    // Default headers
    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };

    // Merge default headers with custom headers
    const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };


    // Configure fetch options
    const config: RequestInit = {
        ...fetchOptions,
        headers,
        signal: controller.signal,
    };

    try {
        // Perform fetch request and check for HTTP errors
        const response = await fetch(url, config);
        clearTimeout(id);
        if (!response.ok) {
            throw new RequestError(response.status, `HTTP error: ${response.status}`);
        }

        // Parse and return JSON response
        return await response.json()
    } catch (err) {
        // Handle fetch errors
        const errorMessage = isError(err) ? err : new Error("An unknown error occurred");
        if (errorMessage.name === "AbortError") {
            logger.warn(`Fetch request to ${url} timed out after ${timeout}ms`);
        } else {
            logger.error(`Fetch request to ${url} failed: ${errorMessage.message}`);
        }

        return handleError(errorMessage) as ActionResponse<T>;
    }
}


// Example usage of fetchHandler
//fetchHandler(`${API_BASE_URL}/accounts/${id}`, 
// { method: "GET" },
// body: JSON.stringify({ accountId: id }),
// );