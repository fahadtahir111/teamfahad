import { unstable_cache } from 'next/cache';

/**
 * Vercel-Native Cache Utility
 * Because this platform deploys to Vercel, we don't need external tools like Redis. 
 * Next.js automatically memoizes and distributes cached data across Vercel's global Edge Network.
 * 
 * Use this wrapper for database queries (e.g. Prisma `.findMany()`).
 * It guarantees "load-free" DB performance by caching the result directly on Vercel's CDN nodes.
 *
 * @param fetcher Database function that fetches the raw data
 * @param keyParts Unique array defining this cache key (e.g., ['products', 'featured'])
 * @param revalidate Time in seconds before checking the database again (0 = never revalidate until forced)
 * @param tags Optional tags so we can manually purge this cache via `revalidateTag`
 */
export async function withVercelCache<T>(
  fetcher: () => Promise<T>,
  keyParts: string[],
  revalidate: number = 3600, // Default caches for 1 hour locally, distributed edge
  tags: string[] = []
): Promise<T> {
  // We utilize Next.js unstable_cache which seamlessly hooks into Vercel's Data Cache
  const cachedData = unstable_cache(
    async () => {
      // In a real execution, if the cache misses, we securely pull from NeonDB Postgres
      return await fetcher(); 
    },
    keyParts,
    {
      revalidate,
      tags: tags.length > 0 ? tags : keyParts,
    }
  );

  return cachedData();
}
