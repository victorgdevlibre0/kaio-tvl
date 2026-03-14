// Products to always exclude from the dashboard
export const EXCLUDED_PRODUCTS = new Set(["APCx", "LCFB", "BHMB", "BHMC"]);

// Token symbols to exclude from contract entries and data aggregation
export const EXCLUDED_SYMBOLS = new Set(["LCFB", "BHMB", "BHMC"]);

// Test products that should be hidden by default (only shown with "Test RWAs" filter)
export const TEST_PRODUCTS = new Set(["Singapore-BMM-test", "Cayman-BMM-test"]);

export type RwaCategory = "production" | "test" | "all";

export function filterProductsByCategory(
  products: string[],
  category: RwaCategory
): string[] {
  return products.filter((p) => {
    if (EXCLUDED_PRODUCTS.has(p)) return false;
    if (category === "production") return !TEST_PRODUCTS.has(p);
    if (category === "test") return TEST_PRODUCTS.has(p);
    return true; // "all"
  });
}

export function isProductVisible(product: string, category: RwaCategory): boolean {
  if (EXCLUDED_PRODUCTS.has(product)) return false;
  if (category === "production") return !TEST_PRODUCTS.has(product);
  if (category === "test") return TEST_PRODUCTS.has(product);
  return true;
}
