const contentDiv = document.getElementById('app');
// const divs = document.getElementById("window");
window.addEventListener('DOMContentLoaded', function () {
  const hash = window.location.hash.slice(1);
  const [page, query] = hash.split('?');
  const mode = new URLSearchParams(query).get('mode');
  loadPage(page || 'landing', mode);
});

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
      case 'otheruser':
        import('./otheruser.js').then(module => {
          module.initOtherUserPage(mode);
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
  if (!mode) {
    const name = urlParams.get('name');
    if (name)
      return name;
  }
  return mode;
}

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