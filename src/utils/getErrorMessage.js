// The backend returns plain strings for BadRequest/Unauthorized (e.g. BadRequest("Invalid email or password")),
// so err.response.data is usually just that string. This helper normalizes whatever shape comes back.
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;

  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    if (data.title) return data.title; // ASP.NET ValidationProblem shape
    if (data.message) return data.message;
    if (data.errors) {
      const firstKey = Object.keys(data.errors)[0];
      const firstError = data.errors[firstKey]?.[0];
      if (firstError) return firstError;
    }
  }
  return fallback;
}
