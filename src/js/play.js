export function initPlayPage() {
    let selectedButton = null;
    // console.log("ffffff");
    // document.getElementById('confirm-button').addEventListener('click', function () {
    //     if (selectedButton) {
    //         const selection = selectedButton.getAttribute('data-selection');
    //         alert('Selection confirmed for ' + selection);
    //         // Redirect to another page based on the selected button
    //         window.location.href = 'https://example.com/' + selection; // Update URL accordingly
    //     } else {
    //         alert('Please select an option first.');
    //     }
    // });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      card.addEventListener('click', function() {
        // Remove 'active' class from all cards
        cards.forEach(c => c.classList.remove('active'));
  
        // Add 'active' class to the clicked card
        this.classList.add('active');
      });
    });
}
