const contentDiv = document.getElementById('app');
document.addEventListener('DOMContentLoaded', function () {
  // Initial route based on hash or default to landing page
  const route = window.location.hash.slice(1) || 'landing';
  loadPage(route);
});

// Function to handle navigation
export function navigateTo(page) {
  // location.hash = page;
  // Clean up the current page before loading the new one
  history.pushState({ page }, '', `#${page}`);
  loadPage(page);
}

// Function to load page content dynamically
function loadPage(page) {
  // const navbar = `
  //   <nav class="navbar navbar-expand-lg navbar-light bg-light">
  //     <a class="nav-link" href="#home">Home</a>
  //     <a class="nav-link" href="#leaderboard">Leaderboard</a>
  //     <a class="nav-link" href="#about">About us</a>
  //   </nav>
  // `;

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
          initializePageScripts(page);
          // Add event listener for the Start button after loading the page
          document.getElementById('startButton').addEventListener('click', function () {
            navigateTo('login'); // Use navigateTo function
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
          initializePageScripts(page);
          // Add event listener for the login form submission
          document.getElementById('loginForm').addEventListener('submit', function (event) {
            event.preventDefault(); // prevent refreshing the page
            navigateTo('home'); // Use navigateTo function
          });
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
        contentDiv.innerHTML = `${html}`;
        // Dynamically load and initialize JavaScript for the page
        initializePageScripts(page);
      })
      .catch(error => {
        contentDiv.innerHTML = '<h1>404 Page Not Found</h1>';
      });
  }
}


function initializePageScripts(page) {
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
    default:
      console.log('No script found for this page');
  }
}

window.addEventListener('popstate', (event) => {
  const page = (event.state && event.state.page) || window.location.hash.slice(1) || 'landing';
  loadPage(page);
});

window.addEventListener('hashchange', () => {
  const page = window.location.hash.slice(1) || 'landing';
  loadPage(page);
});