const contentDiv = document.getElementById('app');
// const divs = document.getElementById("window");
window.addEventListener('DOMContentLoaded', function () {
  const hash = window.location.hash.slice(1);
  const [page, query] = hash.split('?');
  const mode = new URLSearchParams(query).get('mode');
  loadPage(page || 'landing', mode);
});


// Function to handle navigation
// export function navigateTo(page, queryParams = {}) {
//   // Clear all query parameters and hash from the URL
//   const baseUrl = location.origin + '/';
  
//   // Construct query string from the queryParams object
//   const queryString = new URLSearchParams(queryParams).toString();
  
//   // If there are query parameters, append them to the URL
//   const urlWithParams = queryString ? `${baseUrl}#${page}?${queryString}` : `${baseUrl}#${page}`;

//   // Replace the current state to clear any query parameters
//   window.history.replaceState({}, '', baseUrl);
  
//   // Push the new state with the desired page hash and optional query parameters
//   history.pushState({ page }, '', urlWithParams);
//   loadPage(page);
// }

// export function navigateTo(page, queryParams = {}) {
//   const baseUrl = location.origin + '/';
//   const queryString = new URLSearchParams(queryParams).toString();
//   const urlWithParams = queryString ? `${baseUrl}#${page}?${queryString}` : `${baseUrl}#${page}`;

//   // Push the new state directly (don't replace first)
//   history.pushState({ page }, '', urlWithParams);

//   // Load the page content
//   loadPage(page);
// }



// Function to load page content dynamically
function loadPage(page) {
  const token = sessionStorage.getItem('jwtToken');
  if (!token && page !== 'landing')
    page = 'login';
  else if (token && (page === 'login' || page === 'landing'))
    page = 'home';
  // Remove any previously added CSS files for pages
  const existingLink = document.getElementById('page-style');
  if (existingLink) {
    existingLink.remove(); // Remove the old CSS file
  }

  // Dynamically load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `src/css/${page}.css`; // Dynamic CSS based on page
  link.id = 'page-style'; // Assign an ID to the link tag for future removal
  document.head.appendChild(link);

  // Extract query parameters from the URL hash
   const mode = getQueryParamsFromUrl();
   console.log(page, "in LoadPage");
   console.log(mode, "in LoadPage")

  // Handle special cases for landing and login
  if (page === 'landing' || page === 'login') {
    contentDiv.innerHTML = '';
    if (page === 'landing') {
      fetch('src/components/landing.html')
        .then(response => {
          if (!response.ok) throw new Error('Page not found');
          return response.text();
        })
        .then(html => {
          contentDiv.innerHTML = html;
          // Dynamically load and initialize JavaScript for the page
          console.log("landing");
          initializePageScripts(page);
          // Add event listener for the Start button after loading the page
          document.getElementById('startButton').addEventListener('click', function () {
            navigateTo('login');
          });
        })
        .catch(error => {
          contentDiv.innerHTML = '<h1>404 Page Not Found</h1>';
        });
    } else if (page === 'login') {
      fetch('login.html')
        .then(response => {
          if (!response.ok) throw new Error('Page not found');
          return response.text();
        })
        .then(html => {
          contentDiv.innerHTML = html;
          // Dynamically load and initialize JavaScript for the page
          console.log("login");

          initializePageScripts(page);
        })
        .catch(error => {
          console.log(error);
          contentDiv.innerHTML = '<h1>404 Page Not Found</h1>';
        });
    }
  } else {
    // Load components from src/components
    fetch(`src/components/${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
      .then(html => {
        // console.log(html);
        // divs.innerHTML = "";
        contentDiv.innerHTML = `${html}`;
        console.log("other");

        // Dynamically load and initialize JavaScript for the page
        initializePageScripts(page, mode);
      })
      .catch(error => {
        contentDiv.innerHTML = '<h1>404 Page Not Found</h1>';
      });
  }
}


function initializePageScripts(page, mode) {
  console.log("in initializePageScripts");
  const body = document.body;
  const firstChild = body.firstElementChild;
  const appElement = document.getElementById("app");
  // Loop through body children and remove all except the first child and the one with id="app"
  Array.from(body.children).forEach((child) => {
      if (child !== firstChild && child !== appElement) {
        body.removeChild(child);
      }
  });
  // Remove existing script if necessary
  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) {
    existingScript.remove();
  }

  // Dynamically import the relevant module based on the page
  switch (page) {
    case 'home':
      import('./home.js').then(module => {
        module.initHomePage();
      });
      break;
    case 'about':
      import('./about.js').then(module => {
        module.initAboutPage();
      });
      break;
    case 'leaderboard':
      import('./leaderboard.js').then(module => {
        module.initLeaderboardPage();
      });
      break;
    case 'landing':
      import('./landing.js').then(module => {
        module.initLandingPage();
      });
      break;
    case 'login':
      import('./login.js').then(module => {
        module.initLoginPage();
      });
      break;
    case 'play':
      import('./play.js').then(module => {
        module.initPlayPage();
      });
      break;
    case 'profil':
      import('./profil.js').then(module => {
        module.initProfilPage();
      });
      break;
      case 'game':
        import('./game.js').then(module => {
          module.initGamePage(mode);
        });
        break;
    default:
      console.log('No script found for this page');
  }
}

// Helper function to get query parameters from the current URL
function getQueryParamsFromUrl() {
  const hash = window.location.hash;
  const queryString = hash.split('?')[1]; // after '?'
  const urlParams = new URLSearchParams(queryString);
  const mode = urlParams.get('mode');
  return mode;
}

// window.addEventListener('popstate', (event) => {
//   const hash = window.location.hash.slice(1);
//   const [page, query] = hash.split('?');
//   const mode = new URLSearchParams(query).get('mode');
//   console.log("POPSTATE: ", page);

//   loadPage(page || 'landing', mode);
// });

// window.addEventListener('hashchange', () => {
//   const hash = window.location.hash.slice(1);
//   const [page, query] = hash.split('?');
//   const mode = new URLSearchParams(query).get('mode');
//   console.log("HASH CHANGE", page);
//   loadPage(page || 'landing', mode);
// });

// Remove the popstate listener, only keep hashchange
// window.addEventListener('hashchange', () => {
//   const hash = window.location.hash.slice(1);
//   const [page, query] = hash.split('?');
//   const mode = new URLSearchParams(query).get('mode');
//   console.log("HASH CHANGE", page);
//   loadPage(page || 'landing', mode);
// });

// Update navigateTo to change only the hash, avoiding pushState where unnecessary
// export function navigateTo(page, queryParams = {}) {
//   const queryString = new URLSearchParams(queryParams).toString();
//   const urlWithParams = queryString ? `#${page}?${queryString}` : `#${page}`;
//   window.location.hash = urlWithParams; // Triggers the hashchange event
// }

// let lastHash = window.location.hash;

// // Use a single listener to handle routing
// function handleRouting(event) {
//   console.log("event : ", event);
//   const hash = window.location.hash.slice(1);
//   if (lastHash === hash) return; // Prevent duplicate triggers
//   lastHash = hash;

//   const [page, query] = hash.split('?');
//   const mode = new URLSearchParams(query).get('mode');
//   loadPage(page || 'landing', mode);
// }

// window.addEventListener('hashchange', handleRouting);
// window.addEventListener('popstate', handleRouting);

// export function navigateTo(page, queryParams = {}) {
//   // Construct query string from queryParams object
//   const queryString = new URLSearchParams(queryParams).toString();
//   const urlWithParams = queryString ? `#${page}?${queryString}` : `#${page}`;

//   // Check if the current hash is the same as the new one to avoid duplicate events
//   if (window.location.hash === urlWithParams) return;

//   // Update the hash (triggers hashchange)
//   window.location.hash = urlWithParams;
// }

// let lastHash = window.location.hash; // Track the last known hash to prevent duplicates

// function handleRouting(event) {
//   // Extract the current hash
//   const hash = window.location.hash.slice(1);

//   // Prevent handling if the hash hasn't changed
//   if (lastHash === hash) return;
//   lastHash = hash;

//   // Split the hash into page and query
//   const [page, query] = hash.split('?');
//   const queryParams = new URLSearchParams(query);

//   // Extract specific query params (example: 'mode')
//   const mode = queryParams.get('mode');

//   // Clean the URL if it contains a login code
//   if (window.location.search.includes('code=')) {
//     // Preserve the current hash but remove the search query
//     history.replaceState(null, '', `${window.location.origin}${window.location.pathname}${window.location.hash}`);
//   }

//   // Call the page loader with the appropriate parameters
//   loadPage(page || 'landing', mode);
// }

// // Add a single event listener for both hashchange and popstate
// window.addEventListener('hashchange', handleRouting);


// export function navigateTo(page, queryParams = {}) {
//   // Construct the query string from the queryParams object
//   const queryString = new URLSearchParams(queryParams).toString();
//   const hash = queryString ? `#${page}?${queryString}` : `#${page}`;

//   // Build the full URL, starting from the base URL
//   const fullUrl = `${window.location.origin}/${hash}`;

//   // Check if the current URL is already the target URL to avoid redundant updates
//   if (window.location.href === fullUrl) return;

//   // Update the URL while resetting the base path
//   history.replaceState(null, '', fullUrl);

//   // Trigger page load for the given page
//   loadPage(page);
// }

// let lastHash = window.location.hash; // Track the last known hash

// function handleRouting(event) {
//   // Get the current hash, excluding the `#`
//   const hash = window.location.hash.slice(1);

//   // Prevent duplicate handling if the hash hasn't changed
//   if (lastHash === hash) return;
//   lastHash = hash;

//   // Split the hash into the page name and query parameters
//   const [page, query] = hash.split('?');
//   const queryParams = new URLSearchParams(query);

//   // Handle specific query parameters (e.g., mode)
//   const mode = queryParams.get('mode');

//   // If the URL contains a login code, clean it
//   if (window.location.search.includes('code=')) {
//     // Remove the search query and reset the path to root
//     history.replaceState(null, '', `${window.location.origin}/${window.location.hash}`);
//   }

//   // Load the appropriate page
//   loadPage(page || 'landing', mode);
// }

// // Add a single event listener for routing
// window.addEventListener('hashchange', handleRouting);


export function navigateTo(page, queryParams = {}) {
  // Construct the query string from the queryParams object
  const queryString = new URLSearchParams(queryParams).toString();
  const hash = queryString ? `#${page}?${queryString}` : `#${page}`;

  // Build the full URL, starting from the base URL
  const fullUrl = `${window.location.origin}/${hash}`;

  // Check if the current URL is already the target URL to avoid redundant updates
  if (window.location.href === fullUrl) return;

  // Push the new state with the updated URL
  history.pushState({ page }, '', fullUrl);

  // Trigger page load for the given page
  loadPage(page);
}

let lastHash = window.location.hash; // Track the last known hash

function handleRouting() {
  // Get the current hash, excluding the `#`
  const hash = window.location.hash.slice(1);

  // Prevent duplicate handling if the hash hasn't changed
  if (lastHash === hash) return;
  lastHash = hash;

  // Split the hash into the page name and query parameters
  const [page, query] = hash.split('?');
  const queryParams = new URLSearchParams(query);

  // Handle specific query parameters (e.g., mode)
  const mode = queryParams.get('mode');

  // If the URL contains a login code, clean it
  if (window.location.search.includes('code=')) {
    // Remove the search query and reset the path to root
    history.replaceState(null, '', `${window.location.origin}/${window.location.hash}`);
  }

  // Load the appropriate page
  loadPage(page || 'landing', mode);
}

// Add a single event listener for routing
window.addEventListener('hashchange', handleRouting);
window.addEventListener('popstate', (event) => {
  // Ensure proper routing on back/forward navigation
  handleRouting(event);
});