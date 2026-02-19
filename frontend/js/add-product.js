// BARCODE SCANNING
const scanBtn = document.getElementById("scanBtn");
const video = document.getElementById("cameraPreview");
const barcodeInput = document.getElementById("barcode");

const codeReader = new ZXing.BrowserMultiFormatReader();

if (scanBtn) {
  scanBtn.addEventListener("click", async () => {
    try {
      video.style.display = "block";

      const devices = await codeReader.listVideoInputDevices();
      const selectedDeviceId = devices[0].deviceId;

      codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result, err) => {
        if (result) {
          barcodeInput.value = result.text;
          codeReader.reset();
          video.style.display = "none";
        }
      });
    } catch (error) {
      console.error("Error starting scanner:", error);
    }
  });
}



// ORIGINAL ADD PRODUCT CODE
const form = document.getElementById("addProductForm");
const error = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  addProduct();
});

async function addProduct() {
  const name = document.getElementById("name").value.trim();
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const barcode = document.getElementById("barcode").value;

  if (!name || quantity === "" || quantity < 0) {
    error.textContent = "Please enter a valid name and quantity.";
    return;
  }

  const data = { name, quantity, price, barcode };

  const res = await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (res.ok) {
    alert("Product added!");
    form.reset();
  } else {
    alert(result.message);
  }
}
