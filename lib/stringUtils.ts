/**
 * Capitalizes the first letter of a given string.
 * @param str - The input string to capitalize.
 * @returns The input string with its first letter capitalized.
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Returns the appropriate Tailwind CSS color class for a given order status.
 * @param status - The order status.
 * @returns The corresponding Tailwind CSS color class.
 */
export function getStatusColors(status: string): { bg: string; text: string } {
  switch (status.toLowerCase()) {
    case "pending":
      return { bg: "254 243 199", text: "161 98 7" }; // yellow-100, yellow-700
    case "processing":
      return { bg: "191 219 254", text: "29 78 216" }; // blue-200, blue-700
    case "shipped":
      return { bg: "233 213 255", text: "109 40 217" }; // purple-200, purple-700
    case "delivered":
      return { bg: "187 247 208", text: "21 128 61" }; // green-200, green-700
    case "cancelled":
      return { bg: "254 202 202", text: "185 28 28" }; // red-200, red-700
    default:
      return { bg: "229 231 235", text: "55 65 81" }; // gray-200, gray-700
  }
}
