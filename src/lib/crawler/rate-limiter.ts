// Rate limiting utility to prevent IP blocks during crawling
import pLimit from "p-limit";

const domainLimits = new Map<string, ReturnType<typeof pLimit>>();

/**
 * Get a rate limiter for a specific domain
 * Each domain gets its own limiter to control concurrent requests
 */
export function getRateLimiter(url: string, concurrency = 1) {
  const domain = new URL(url).hostname;
  if (!domainLimits.has(domain)) {
    domainLimits.set(domain, pLimit(concurrency));
  }
  return domainLimits.get(domain)!;
}

/**
 * Delay execution for specified milliseconds
 * Used between requests to respect rate limits
 */
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
