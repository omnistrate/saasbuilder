class ProviderAuthError extends Error {
  constructor(message = "Provider Auth Error") {
    super(message);
    this.name = "ProviderAuthError";
  }
}

module.exports = ProviderAuthError;
