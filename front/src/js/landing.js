import { navigateTo } from "./main.js";

export function initLandingPage() {
    console.log("LANDING PAGE");
    // This function runs immediately when the page is rendered
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);

    // Example: Extract a query parameter called 'code'
    const authCode = urlParams.get("code");

    if (authCode) {
      console.log("Authorization Code:", authCode);
      fetchOAuthCode(authCode);
    } else {
      console.log("No authorization code found.");
    }
}

async function fetchOAuthCode(authCode) {
  try {
    console.log("before");
    const response = await fetch(
      "http://0.0.0.0:8000/oauthcallback?code=" + authCode
    );
    if (response.ok) {
      console.log("AFTER");
      console.log("Authentication initiated successfully");
      console.log(response);
      let rewind = await response.json();
      const token = rewind.access;
      sessionStorage.setItem("jwtToken", token);
      navigateTo("home");
    } else {
      console.error("Failed to initiate 42 authentication");
    }
  } catch (error) {
    console.error("Login with 42 failed:", error);
  }
}
