var products = [
    "Фотопрогрулка Light - до 30 минут / 15 фото",
    "Фотопрогрулка Standard - до 50 минут / 35 фото",
    "Фотопрогрулка Full - до 80 минут / 55 фото"
];

document.addEventListener("DOMContentLoaded", function (event) {
    initNav();
    initLightbox();
    initPrice();
});

function initNav() {
    var ticking = false, maxScrolledPosition = 170, navbar = document.getElementById("navbar");
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
        if (scrollPosition < maxScrolledPosition) {
            if (navbar.className.indexOf("expand") < 0) {
                navbar.classList.add("expand");
            }
        } else {
            if (navbar.className.indexOf("expand") >= 0 && navbar.className.indexOf("no-expand") < 0) {
                navbar.classList.remove("expand");
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

function initPrice() {
    var next = document.getElementById("nextPrice"),
        prev = document.getElementById("prevPrice"),
        price = document.querySelector(".price-list"),
        priceItems = document.querySelectorAll(".price-list .item"),
        orderButtons = document.querySelectorAll(".price-list .item .price"),
        cancelOrderBtn = document.getElementById("cancel-order"),
        orderForm = document.querySelector(".order-form");

    next.addEventListener("click", changePriceItem);
    prev.addEventListener("click", changePriceItem.bind(this, true));

    for (var i = 0; i < orderButtons.length; i++) {
        var btn = orderButtons[i];
        btn.addEventListener("click", preOrder.bind(this, i));
    }

    cancelOrderBtn.addEventListener("click", cancelOrder);

    function changePriceItem(prev) {
        for (var i = 0; i < priceItems.length; i++) {
            var item = priceItems[i];
            if (item.classList.contains("active")) {
                item.classList.remove("active");
                if (prev) {
                    var nextIndex = (i - 1) < 0 ? priceItems.length - 1 : i - 1;
                } else {
                    var nextIndex = (i + 1) >= priceItems.length ? 0 : i + 1;
                }
                priceItems[nextIndex].classList.add("active");
                return;
            }
        }
        priceItems[0].classList.add("active");
    }

    function preOrder(option) {
        price.classList.add("hidden");
        orderForm.classList.add("show");
        document.getElementById("order-product").innerHTML = products[option];
    }

    function cancelOrder(e) {
        e.preventDefault();
        price.classList.remove("hidden");
        orderForm.classList.remove("show");
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