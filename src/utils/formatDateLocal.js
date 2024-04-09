function formatDateLocal(timestamp) {
  const zone = new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ')[2]
  return new Date(timestamp).toLocaleString() + " " + zone;
}

export default formatDateLocal;
