var ticking = false, minScrolledPosition = 170, navbar = document.getElementById("navbar");
window.addEventListener('scroll', function (e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(function () {
            checkScrolledClass(last_known_scroll_position);
            ticking = false;
        });
    }
    ticking = true;
});

function checkScrolledClass(scrollPosition) {
    if (scrollPosition > minScrolledPosition) {
        navbar.classList.add("shrink");
    } else {
        if (!navbar.classList.contains("no-expand")) {
            navbar.classList.remove("shrink");
        }
    }
}