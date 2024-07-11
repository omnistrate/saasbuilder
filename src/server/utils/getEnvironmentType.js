const {
  ENVIRONMENT_TYPES,
} = require("src/server/utils/constants/environmentTypes");

function getEnvironmentType() {
  const environmentType = process.env.ENV_TYPE || ENVIRONMENT_TYPES.PROD;
  return environmentType;
}

module.exports = {
  getEnvironmentType,
};
