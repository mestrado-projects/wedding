export function detectQueryType(query: string): "name" | "phone" {
  const digits = query.replace(/\D/g, "").length;
  const letters = query.replace(/[^a-zA-ZÀ-ÿ]/g, "").length;
  
  return digits > letters ? "phone" : "name";
}
