export function saveBlob(blob, fileName) {
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround
    window.navigator.msSaveBlob(blob, filename);
  } else {
    let URL = window.URL;
    let downloadUrl = URL.createObjectURL(blob);
    if (fileName) {
      let a = document.createElement("a");
      if (typeof a.download === "undefined") {
        window.location.href = downloadUrl;
      } else {
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
      }
    } else {
      window.location.href = downloadUrl;
    }
    // cleanup
    setTimeout(function () {
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  }
}
