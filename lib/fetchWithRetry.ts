export async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<Response> {
  let attempt = 1;
  while (true) {
    try {
      const response = await fetch(url);
      
      // If success or 4xx client error (do not retry 4xx as per instructions)
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        if (!response.ok) {
          throw new Error(`Client error: ${response.status} ${response.statusText} for ${url}`);
        }
        return response;
      }
      
      // For 5xx server errors, retry
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
      
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (attempt >= retries) {
        throw new Error(`Failed after ${retries} attempts: ${msg}`);
      }
      
      console.warn(`Attempt ${attempt} failed for ${url}: ${msg}. Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      delayMs *= 2; // Exponential backoff
      attempt++;
    }
  }
}
