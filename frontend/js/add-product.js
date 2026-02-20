// BARCODE SCANNING
const scanBtn = document.getElementById("scanBtn");
const video = document.getElementById("cameraPreview");
const barcodeInput = document.getElementById("barcode");
const scanStatus = document.getElementById("scanStatus");

const codeReader = new ZXing.BrowserMultiFormatReader();

if (scanBtn) {
  scanBtn.addEventListener("click", async () => {
    scanStatus.textContent = "Starting camera...";
    scanStatus.className = "scan-status";

    try {
      video.style.display = "block";

      const devices = await codeReader.listVideoInputDevices();
      if (!devices.length) {
        scanStatus.textContent = "No camera found.";
        scanStatus.classList.add("error-text");
        return;
      }

      codeReader.decodeFromVideoDevice(
        devices[0].deviceId,
        video,
        (result, err) => {
          if (result) {
            barcodeInput.value = result.text;
            scanStatus.textContent = "✔ Barcode scanned successfully";
            scanStatus.classList.add("success-text");

            codeReader.reset();
            video.style.display = "none";
          }

          if (err && !(err instanceof ZXing.NotFoundException)) {
            scanStatus.textContent = "Scan failed. Try again.";
            scanStatus.classList.add("error-text");
          }
        }
      );
    } catch {
      scanStatus.textContent = "Camera access denied.";
      scanStatus.classList.add("error-text");
    }
  });
}

// ADD PRODUCT
const form = document.getElementById("addProductForm");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: name.value.trim(),
    quantity: quantity.value,
    price: price.value,
    barcode: barcode.value
  };

  if (!data.name || data.quantity === "") {
    error.textContent = "Please enter a valid name and quantity.";
    return;
  }

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Product added!");
    form.reset();
    scanStatus.textContent = "";
  } else {
    const result = await res.json();
    alert(result.message);
  }
});
