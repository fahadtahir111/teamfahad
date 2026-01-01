/**
 * Currency conversion utilities
 * USD to PKR conversion rate (approximate)
 */
const USD_TO_PKR_RATE = 278;

/**
 * Convert USD price to PKR
 */
export const usdToPkr = (usdPrice: number): number => {
    return Math.round(usdPrice * USD_TO_PKR_RATE);
};

/**
 * Format price in PKR
 */
export const formatPkr = (price: number): string => {
    return `₨${price.toLocaleString('en-PK')}`;
};

/**
 * Convert and format USD to PKR
 */
export const formatUsdToPkr = (usdPrice: number): string => {
    return formatPkr(usdToPkr(usdPrice));
};

