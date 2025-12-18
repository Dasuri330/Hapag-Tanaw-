// Select all section elements and nav links
const sections = document.querySelectorAll('.menu-section');
const navLinks = document.querySelectorAll('.second-nav .nav-link');

// Function to update active link
function setActiveLink() {
    let index = sections.length;

    while (--index && window.scrollY + 100 < sections[index].offsetTop) { } // 100px offset

    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');
}

// Listen for scroll events
window.addEventListener('scroll', setActiveLink);

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

const menuNavbar = document.getElementById('menuNav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        menuNavbar.classList.add('scrolled');
    } else {
        menuNavbar.classList.remove('scrolled');
    }
});

