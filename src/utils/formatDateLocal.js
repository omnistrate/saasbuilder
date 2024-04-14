function formatDateLocal(timestamp) {
  const zone = new Date().toLocaleTimeString(undefined, { timeZoneName: 'short' }).split(' ')[2]
  if (!zone) {
    return new Date(timestamp).toLocaleString();
  }
  return new Date(timestamp).toLocaleString() + " " + zone;
}

export default formatDateLocal;
