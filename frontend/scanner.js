let scanningLocked = false;

function showBanner(message, type = "success") {
    const banner = document.getElementById("banner");
    banner.textContent = message;
    banner.className = `banner show ${type}`;
    setTimeout(() => banner.classList.remove("show"), 3000);
}

function showError(msg) { showBanner(msg, "error"); }
function showSuccess(msg) { showBanner(msg, "success"); }
function showWarning(msg) { showBanner(msg, "warning"); }

async function handleBarcode(barcode) {
    if (!barcode || barcode.length < 6) {
        showError("Invalid barcode");
        restartScanner();
        return;
    }

    try {
        const response = await fetch(`/api/products/barcode/${barcode}`);
        const product = await response.json();

        if (!response.ok) {
            showError(product.error || "Product not found");
            restartScanner();
            return;
        }

        await updateStock(barcode);

    } catch (error) {
        showError("Server error");
        restartScanner();
    }
}

async function updateStock(barcode) {
    try {
        const response = await fetch("/api/products/update-by-barcode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                barcode: barcode,
                quantityChange: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || "Update failed");
        } else {
            showSuccess(data.message || "Stock updated!");
            if (data.lowStock) showWarning("⚠ Low stock!");
        }

    } catch (e) {
        showError("Backend unavailable");
    }

    restartScanner();
}

function restartScanner() {
    scanningLocked = false;
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess
    );
}

function onScanSuccess(decodedText) {
    if (scanningLocked) return;
    scanningLocked = true;

    html5QrCode.stop().then(() => {
        handleBarcode(decodedText);
    }).catch(() => {
        handleBarcode(decodedText);
    });
}

const html5QrCode = new Html5Qrcode("reader");

Html5Qrcode.getCameras().then(cameras => {
    if (cameras.length)
        html5QrCode.start(
            cameras[0].id,
            { fps: 10, qrbox: 250 },
            onScanSuccess
        );
}).catch(() => showError("Camera access denied"));
