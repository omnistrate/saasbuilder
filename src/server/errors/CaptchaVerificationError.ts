class CaptchaVerificationError extends Error {
  constructor(message = "Captcha Verification Error") {
    super(message);
    this.name = "CaptchaVerificationError";
  }
}

module.exports = CaptchaVerificationError;
