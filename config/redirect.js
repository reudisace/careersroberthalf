// Redirect configuration for client-side navigation triggered from Telegram
// Set NEXT_PUBLIC_REDIRECT_URL in your frontend env to control target URL.
export const getRedirectUrl = () => {
  // Default fallback if env not provided
  const url = process.env.NEXT_PUBLIC_REDIRECT_URL || "https://example.com/";
  return url;
};
