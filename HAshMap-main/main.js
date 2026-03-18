/* slogan bar sa homepage */
const sloganBar = document.getElementById('sloganBar');

if (sloganBar) {
    function handleScroll() {
        if (window.scrollY === 0) {
            sloganBar.classList.add('active');
        } else {
            sloganBar.classList.remove('active');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

/* for dropdown menus */
const hasDropdown = document.querySelector('.has-dropdown');

if (hasDropdown) {
    const toggle = hasDropdown.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        hasDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function () {
        hasDropdown.classList.remove('open');
    });

    hasDropdown.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}

/* active link indicator */
document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href;
    let isDropdownActive = false;

    // Check dropdown items
    document.querySelectorAll('.dropdown-item').forEach(link => {
        if (link.getAttribute('href') && currentUrl.includes(link.getAttribute('href'))) {
            link.classList.add('active');
            isDropdownActive = true;
        }
    });

    if (isDropdownActive) {
        const toggleBtn = document.querySelector('.dropdown-toggle');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
        }
    } else {
        // Check home link
        if (currentUrl.includes('WelcomeInterFace.html') || currentUrl.endsWith('/') || currentUrl.endsWith('#')) {
            const homeBtns = document.querySelectorAll('nav ul li a button');
            homeBtns.forEach(btn => {
                if (btn.textContent.trim() === 'Home') {
                    btn.classList.add('active');
                }
            });
        }
    }
});
