const contentDiv = document.getElementById('app');
export const eventRegistry = [];

// const divs = document.getElementById("window");
window.addEventListener('DOMContentLoaded', function () {
  const hash = window.location.hash.slice(1);
  const [page, query] = hash.split('?');
  const mode = new URLSearchParams(query).get('mode');
  loadPage(page || 'landing', mode);
}, { once: true });

async function loadPage(page, mode = null) {
  const token = localStorage.getItem("jwtToken");
  if (!token && page !== 'landing') {
    page = 'login';
  }
  else if (token && (page === 'landing' || page === 'login'))
    page = 'home';

  const existingLink = document.getElementById('page-style');
  if (existingLink) {
    existingLink.remove(); // Remove the old CSS file
  }

  // Dynamically load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `src/css/${page}.css`;
  link.id = 'page-style'; // Assign an ID to the link tag for future removal
  document.head.appendChild(link);

  // Handle page loading and rendering dynamically
  contentDiv.innerHTML = ''; // Clear previous content
  console.log("TMS7 KOLO");
  // Extract query parameters from the URL hash
  const modeToSend = getQueryParamsFromUrl();
  console.log(page, "in LoadPage");

  if (page === 'landing' || page === 'login') {
    // Clear the content area and load the landing or login page
    if (page === 'landing') {
      fetch('src/components/landing.html')
        .then(response => response.text())
        .then(html => {
          contentDiv.innerHTML = html;
          initializePageScripts(page);
          // Event listener for landing page interaction
          document.getElementById('startButton').addEventListener('click', () => navigateTo('login'));
        })
        .catch(() => contentDiv.innerHTML = '<h1>404 Page Not Found</h1>');
    } else if (page === 'login') {
      fetch('login.html')
        .then(response => response.text())
        .then(html => {
          contentDiv.innerHTML = html;
          initializePageScripts(page);
        })
        .catch(() => contentDiv.innerHTML = '<h1>404 Page Not Found</h1>');
    }
  } else {
    // Load component dynamically for other pages
    fetch(`src/components/${page}.html`)
      .then(response => response.text())
      .then(html => {
        contentDiv.innerHTML = html;
        console.log("INITIAT SCRIPT :", page)
        initializePageScripts(page, modeToSend);
      })
      .catch(() => contentDiv.innerHTML = '<h1>404 Page Not Found</h1>');
  }
}

function initializePageScripts(page, mode) {
  console.log("in initializePageScripts");
  // cleanUpCurrentPage();

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
  removeAllEventListeners();
  const existingScript = document.getElementById('dynamic-script');
  if (existingScript) {
    existingScript.remove();
  }

  // const clonedContentDiv = contentDiv.cloneNode(true); // False will not clone child nodes, just the div itself
  // contentDiv.parentNode.replaceChild(clonedContentDiv, contentDiv);
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

function getQueryParamsFromUrl() {
  const hash = window.location.hash;
  const queryString = hash.split('?')[1]; // after '?'
  const urlParams = new URLSearchParams(queryString);
  const modeToGet = urlParams.get('mode');
  if (!modeToGet) {
    const name = urlParams.get('name');
    if (name)
      return name;
  }
  return modeToGet;
}

export function navigateTo(page, queryParams = {}) {
  const queryString = new URLSearchParams(queryParams).toString();
  const hash = queryString ? `#${page}?${queryString}` : `#${page}`;

  const fullUrl = `${window.location.origin}/${hash}`;

  if (window.location.href === fullUrl) return;

  history.pushState({ page }, '', fullUrl);

  handleRouting();
}

let lastHash = window.location.hash;

function handleRouting() {
  const hash = window.location.hash.slice(1);

  if (lastHash === hash) return;
  lastHash = hash;

  const [page, query] = hash.split('?');
  const queryParams = new URLSearchParams(query);

  const modeToGet = queryParams.get('mode');

  if (queryParams.has('code')) {
    queryParams.delete('code');
    const cleanedUrl = `${window.location.origin}/${window.location.pathname}#${page}?${queryParams.toString()}`;

    history.replaceState(null, '', cleanedUrl);
  }

  // Load the appropriate page
  loadPage(page || 'landing', modeToGet);
}

// // Add a single event listener for routing
// window.addEventListener('hashchange', handleRouting);
// window.addEventListener('popstate', (event) => {
//   // Ensure proper routing on back/forward navigation
//   handleRouting(event);
// });

if (!window._listenersAdded) {
  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('popstate', (event) => {
    handleRouting(event);
  });
  window._listenersAdded = true;
}

export function removeAllEventListeners() {
  console.log("---------------------");

  console.log(eventRegistry.length, "THEIR LENGTH");
  eventRegistry.forEach(({ element, eventType, handler }) => {
    element.removeEventListener(eventType, handler);
  });
  eventRegistry.length = 0;
  // eventRegistry = [];
  console.log("---------------------");
  console.log(eventRegistry, "ALL DELETED");
}

// Sync session in all tabs
export function syncSession() {
  localStorage.setItem('sessionSync', Date.now());
}

// Listen for `storage` changes in other tabs
window.addEventListener('storage', (event) => {
  if (event.key === 'jwtToken' || event.key === 'sessionSync') {
      const jwtToken = localStorage.getItem('jwtToken');
      if (jwtToken) {
          console.log(`Logged in as user: ${jwtToken}`);
      } else {
          console.log('Logged out');
      }
  }
});