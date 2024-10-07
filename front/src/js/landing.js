import { navigateTo } from "./main.js";

export function initLandingPage() {
    console.log("LANDING PAGE");
      // This script runs when the page loads
  window.onload = async function () {
    // Get the query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);

    // Example: Extract a query parameter called 'code'
    const authCode = urlParams.get("code");

    if (authCode) {
      console.log("Authorization Code:", authCode);
      try {
        const response = await fetch(
          "http://0.0.0.0:8000/oauthcallback?code=" + authCode
        );
        if (response.ok) {
          console.log("Authentication initiated successfully");
          console.log(response);
          let rewind = await response.json();
          const token = rewind.access; // Replace with actual token retrieval
          sessionStorage.setItem("jwtToken", token);
          navigateTo("home"); // to be changed later on
        } else {
          console.error("Failed to initiate 42 authentication");
        }
      } catch (error) {
        console.error("Login with 42 failed:", error);
      }
    } else {
      // Handle the absence of the authorization code
      console.log("No authorization code found.");
    }
  };
}