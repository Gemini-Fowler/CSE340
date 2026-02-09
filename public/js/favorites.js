// Favorites functionality for detail page

document.addEventListener('DOMContentLoaded', function () {
    const favoriteBtn = document.getElementById('favoriteBtn');

    if (favoriteBtn) {
        const invId = favoriteBtn.getAttribute('data-inv-id');

        // Check if already favorited
        checkFavoriteStatus(invId);

        // Add click event listener
        favoriteBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleFavorite(invId);
        });
    }

    // Handle remove favorite buttons on favorites page
    const removeForms = document.querySelectorAll('.remove-favorite-form');
    removeForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const invId = this.getAttribute('data-inv-id');
            removeFavorite(invId, this);
        });
    });
});

async function checkFavoriteStatus(invId) {
    // This would require a new endpoint to check status
    // For now, button starts as "Add to Favorites"
    // Could enhance with an AJAX call to check if already favorited
}

async function toggleFavorite(invId) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const isFavorited = favoriteBtn.textContent.includes('Remove');

    const url = isFavorited ? '/favorites/remove' : '/favorites/add';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inv_id: invId })
        });

        const data = await response.json();

        if (data.success) {
            // Toggle button text and style
            if (isFavorited) {
                favoriteBtn.textContent = '❤ Add to Favorites';
                favoriteBtn.classList.remove('favorited');
            } else {
                favoriteBtn.textContent = '💔 Remove from Favorites';
                favoriteBtn.classList.add('favorited');
            }

            // Show success message
            showMessage(data.message, 'success');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

async function removeFavorite(invId, form) {
    try {
        const response = await fetch('/favorites/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inv_id: invId })
        });

        const data = await response.json();

        if (data.success) {
            // Remove the vehicle from the display
            form.closest('li').remove();

            // Check if there are no more favorites
            const favoritesList = document.getElementById('favorites-display');
            if (favoritesList && favoritesList.children.length === 0) {
                favoritesList.innerHTML = '<p class="notice">You have no favorite vehicles yet. Browse our <a href="/inv">inventory</a> to add some!</p>';
            }

            showMessage('Vehicle removed from favorites', 'success');
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again.', 'error');
    }
}

function showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'notice' : 'danger'}`;
    messageDiv.textContent = message;

    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageDiv, main.firstChild);

        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}
