document.addEventListener("DOMContentLoaded", function (event) {
    initNav();
    initLightbox();
});

function initNav() {
    var ticking = false, minScrolledPosition = 170, navbar = document.getElementById("navbar");
    window.addEventListener('scroll', updateScrollPosition);
    setInterval(updateScrollPosition, 200);

    var navLinks = document.querySelectorAll("[data-active-until]"), navLinkEndElements = [], navLinkStartElements = [];
    for (var i = 0; i < navLinks.length; i++) {
        var endId = navLinks[i].getAttribute("data-active-until");
        var endEl = document.getElementById(endId);
        navLinkEndElements.push(endEl || null);
        var startId = navLinks[i].getAttribute("data-active-after");
        var startEl = document.getElementById(startId);
        navLinkStartElements.push(startEl || null);
    }

    function updateScrollPosition() {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function () {
                checkScrolledClass(last_known_scroll_position);
                if (navbar.className.indexOf("blog") < 0) {
                    updateActiveLink();
                }
                ticking = false;
            });
        }
        ticking = true;
    }

    function checkScrolledClass(scrollPosition) {
        if (scrollPosition > minScrolledPosition) {
            if (navbar.className.indexOf("shrink") < 0) {
                navbar.classList.add("shrink");
            }
        } else {
            if (navbar.className.indexOf("shrink") >= 0 && navbar.className.indexOf("no-expand") < 0) {
                navbar.classList.remove("shrink");
            }
        }
    }

    function updateActiveLink() {
        var found = false;
        for (var i = 0; i < navLinks.length; i++) {
            if (!found && isLinkActive(navLinkEndElements[i], navLinkStartElements[i])) {
                found = true;
                navLinks[i].classList.add("active");
            } else {
                navLinks[i].classList.remove("active");
            }
        }
    }

    function isLinkActive(endEl, startEl) {
        if (endEl == null) {
            return false;
        }
        if (startEl) {
            var sRect = startEl.getBoundingClientRect();
            if (sRect.top > (window.innerHeight || document.documentElement.clientHeight)) {
                return false;
            }
        }
        var rect = endEl.getBoundingClientRect();
        return rect.top >= (window.innerHeight || document.documentElement.clientHeight) / 2;
    }
}

function initLightbox() {
    var imgGroups = {}, currentGroup = [], currentUrl = "", lb, lbClose, lbBack, lbImgWrapper, lbImg;

    lb = document.getElementById("lightbox");
    if (lb == null) {
        return;
    }
    lbBack = lb.children[0];
    lbClose = lb.children[1];
    lbImgWrapper = lb.children[2];
    lbImg = lbImgWrapper.children[0];
    lbBack.addEventListener("click", prevImg);
    lb.addEventListener("click", hideLightbox);
    lbClose.addEventListener("click", hideLightbox);
    lbImg.addEventListener("click", nextImg);
    var images = document.querySelectorAll("[data-lb-url]");
    for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var fullUrl = img.getAttribute("data-lb-url"),
            group = img.getAttribute("data-lb-group") || i.toString();
        if (fullUrl) {
            imgGroups[group] = imgGroups[group] || [];
            imgGroups[group].push(fullUrl);
            img.addEventListener("click", showLightbox.bind(this, group, fullUrl));
        }
    }

    function showLightbox(groupName, url) {
        lb.classList.remove("hidden");
        currentGroup = imgGroups[groupName];
        currentUrl = url || currentGroup[0];
        lbBack.style.visibility = currentGroup.length > 1 ? "visible" : "hidden";
        lbBack.style.visibility = currentGroup.length > 1 ? "visible" : "hidden";
        lbImg.setAttribute("src", currentUrl);
    }

    function hideLightbox(groupName, url) {
        lb.classList.add("hidden");
        currentUrl = "";
        lbImg.setAttribute("src", currentUrl);
    }

    function nextImg(e) {
        e.stopPropagation();
        var currentIndex = currentGroup.indexOf(currentUrl);
        if (currentIndex + 1 >= currentGroup.length) {
            currentIndex = -1;
        }
        currentUrl = currentGroup[currentIndex + 1];
        lbImg.setAttribute("src", currentUrl);
    }

    function prevImg(e) {
        e.stopPropagation();
        var nextIndex = currentGroup.indexOf(currentUrl) - 1;
        if (nextIndex < 0) {
            nextIndex = currentGroup.length - 1;
        }
        currentUrl = currentGroup[nextIndex];
        lbImg.setAttribute("src", currentUrl);
    }
}

function isElementInViewport(el) {
    if (typeof el === "string") {
        el = document.getElementById(el);
    }
    if (el == null) {
        return false;
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

function scrollIntoView(eleID) {
    var e = document.getElementById(eleID);
    if (!!e && e.scrollIntoView) {
        e.scrollIntoView();
    }
}