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
