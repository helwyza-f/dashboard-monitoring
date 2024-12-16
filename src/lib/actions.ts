export function downloadQRCode(qrCodeData: string, filename: string) {
  // Convert the base64 QR Code to a blob
  const blob = dataURLtoBlob(qrCodeData);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_QRCode.png`; // Set the desired filename
  link.click();

  // Clean up the temporary object URL
  URL.revokeObjectURL(link.href);
}

// Utility function to convert data URI to Blob
function dataURLtoBlob(dataURL: string): Blob {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    arrayBuffer[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
}
