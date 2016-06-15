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

document.addEventListener("DOMContentLoaded", function (event) {
    initLightbox();
});

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