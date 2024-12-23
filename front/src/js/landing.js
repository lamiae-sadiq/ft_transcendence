import { navigateTo } from "./main.js";
import { eventRegistry } from "./main.js";
import { syncSession } from "./main.js";

export function initLandingPage() {
  document.querySelectorAll('img, p, a, div, button').forEach(function(element) {
    element.setAttribute('draggable', 'false');
  });
  console.log("LANDING PAGE");

  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");

  if (authCode) {
    console.log("Authorization Code:", authCode);
    showSpinner(); // Show the spinner when redirect happens
    fetchOAuthCode(authCode);
  } else {
    console.log("No authorization code found.");
  }
}

async function fetchOAuthCode(authCode) {
  try {
    console.log("before");
    console.log("-------------------------------FETCHING-----------------------");
    const response = await fetch(
      "http://0.0.0.0:8000/oauthcallback?code=" + authCode
    );
    if (response.ok) {
      console.log("AFTER");
      console.log("Authentication initiated successfully");

      const rewind = await response.json();
      const token = rewind.access;
      const bool = rewind.twoFa;
      if (bool) {
        // document.getElementById("qrcode").style.display = "block";
        const QR = rewind.qr_code;
        let image = "data:image/jpg;base64," + QR;
        showQRCodeModal(image);

        const qrcElement = document.getElementById('qrc');
          async function handleri(event) {
            event.preventDefault();
            try {
              const response = await fetch(`http://0.0.0.0:8000/2fa/verify/`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  otp: document.querySelector('#qrcode input[type="text"]').value,
                }),
              });
              if (response.ok) {
                // alert("2FA verification successful!");
                let rewind = await response.json();
                const token = rewind.access;
                localStorage.setItem("jwtToken", token);
                syncSession();
                hideSpinner();
                hideQRCodeModal();
                navigateTo("home");
              } else {
                alert("Failed to verify 2FA. Please try again.");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("An error occurred while verifying 2FA.");
            }
          }
          qrcElement.addEventListener("click", handleri);
          eventRegistry.push({
            element: qrcElement,
            eventType: "click",
            handler: handleri
          });
      } else {
        localStorage.setItem("jwtToken", token);
        syncSession();
        hideSpinner();
        hideQRCodeModal();
        navigateTo("home");
      }
    } else {
      console.error("Failed to initiate authentication");
      hideSpinner();
      hideQRCodeModal();
    }
  }
  catch (error) {
    console.error("Login failed:", error);
    hideSpinner();
    hideQRCodeModal();
  }
}

// Spinner functions
function showSpinner() {
  const spinner = document.getElementById("spinnerContainer");
  spinner.classList.remove("d-none");
}

function hideSpinner() {
  const spinner = document.getElementById("spinnerContainer");
  spinner.classList.add("d-none");
}

function showQRCodeModal(imageSrc) {
  const qrcode = document.getElementById("qrcode");
  qrcode.style.display = "flex";
  document.body.classList.add("modal-active");
  const qrImage = document.getElementById("QR");
  qrImage.src = imageSrc;
}

function hideQRCodeModal() {
  const qrcode = document.getElementById("qrcode");
  document.body.classList.remove("modal-active");
  qrcode.style.display = "none";
}
