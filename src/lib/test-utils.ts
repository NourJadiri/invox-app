/**
 * Utility function to simulate slow data fetching for testing loading states.
 * 
 * Usage:
 * ```typescript
 * import { delay } from "@/lib/test-utils";
 * 
 * export default async function Page() {
 *     await delay(2000); // 2 second delay
 *     const data = await getData();
 *     return <Component data={data} />;
 * }
 * ```
 * 
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
