function showBanner(message, type = "success") {
    const banner = document.getElementById("banner");
    banner.textContent = message;
    banner.className = `banner show ${type}`;
}

// SCAN BARCODE
document.getElementById("scanBtn").addEventListener("click", async () => {
    const video = document.getElementById("cameraPreview");
    video.style.display = "block";

    const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });

    video.srcObject = stream;

    const barcodeDetector = new BarcodeDetector({
        formats: ["code_128", "ean_13", "ean_8", "upc_a"]
    });

    const scanLoop = setInterval(async () => {
        try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes.length > 0) {
                const code = barcodes[0].rawValue;

                document.getElementById("barcode").value = code;

                showBanner("Barcode scanned: " + code, "success");

                clearInterval(scanLoop);
                stream.getTracks().forEach(t => t.stop());
                video.style.display = "none";
            }
        } catch (err) {
            console.log("Scanning error:", err);
        }
    }, 300);
});

// ADD PRODUCT
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const quantity = Number(document.getElementById("quantity").value);
    const price = document.getElementById("price").value;
    const barcode = document.getElementById("barcode").value;

    if (!name || quantity <= 0) {
        showBanner("Please fill out required fields correctly.", "error");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, quantity, price, barcode })
        });

        const data = await res.json();

        if (!res.ok) {
            showBanner(data.error || "Failed to add product.", "error");
            return;
        }

        showBanner("Product added successfully!", "success");

        const floatBtn = document.getElementById("floatingViewBtn");
        floatBtn.style.display = "block";
        floatBtn.onclick = () => window.location.href = "products.html";

        e.target.reset();

    } catch (err) {
        showBanner("Server unavailable.", "error");
    }
});
