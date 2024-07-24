function getSaaSDomainURL() {
  const saasDomainAlias = process.env.YOUR_SAAS_DOMAIN_ALIAS;

  if (saasDomainAlias && saasDomainAlias !== "undefined")
    return saasDomainAlias.toLowerCase();
  else return process.env.YOUR_SAAS_DOMAIN_URL?.toLowerCase();
}

module.exports = {
  getSaaSDomainURL,
};
