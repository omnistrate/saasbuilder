export function checkIfResouceIsBYOA(id) {
  if (!id) {
    return false;
  }
  return id?.includes("r-injectedaccountconfig");
}
