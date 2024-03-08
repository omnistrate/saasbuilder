import useProviderOrgDetails from "src/hooks/query/useProviderOrgDetails"

function ProviderFavicon() {


  
  const providerOrgDetailsQuery = useProviderOrgDetails();
  console.log("Provider org query", providerOrgDetailsQuery)
  return (
    <div>ProviderFaviicon</div>
  )
}

export default ProviderFavicon