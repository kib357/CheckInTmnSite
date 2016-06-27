var acceptedText = "Поздравляем, ваш заказ <b>#{{orderId}}</b> принят!"
successText = "Сохраните номер заказа и оставайтесь на связи, мы скоро перезвоним.",
    orderErrorText = "Произошла ошибка на серверe, попробуйте позже или позвоните нам.",
    waitPaymentFormText = "Форма оплаты откроется через {{s}}с.";
var products = [
    "Фотопрогрулка Light – до 30 минут, 15 фото",
    "Фотопрогрулка Standard – до 50 минут, 35 фото",
    "Фотопрогрулка Full – до 80 минут, 55 фото"
];
var amounts = [
    100000,
    200000,
    300000
]

var tinkoffWidget = new TinkoffWidget();
//Функция отображения платежной формы
function makePaymentWithWidget(amount, orderId, description) {
    var params = {
        terminalKey: "checkintmn", //Код терминала (обязательный параметр), выдается банком.
        amount: amount, //Сумма заказа в копейках (обязательный параметр)
        orderId: orderId, //Номер заказа (если не передан, принудительно устанавливается timestamp)
        description: description, //Описание заказа (не обязательный параметр)
    };
    var tinkoffPay = new TinkoffPay();
    tinkoffPay.setMerchantSideParameters(params);
    tinkoffWidget.pay(params);
}

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

    setInterval(function () {
        if (window.innerWidth / window.innerHeight > 1.75) {
            lb.classList.add("v");
        } else {
            lb.classList.remove("v");
        }
    }, 300);

    function showLightbox(groupName, url) {
        lb.classList.remove("hidden");
        currentGroup = imgGroups[groupName];
        currentUrl = url || currentGroup[0];
        lbBack.style.visibility = currentGroup.length > 1 ? "visible" : "hidden";
        lbBack.style.visibility = currentGroup.length > 1 ? "visible" : "hidden";
        lbImg.setAttribute("src", currentUrl);
        document.addEventListener("keydown", keyDownHandler);
        disableScroll();
    }

    function hideLightbox() {
        lb.classList.add("hidden");
        currentUrl = "";
        lbImg.setAttribute("src", currentUrl);
        document.removeEventListener("keydown", keyDownHandler);
        enableScroll();
    }

    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function keyDownHandler(e) {
        if (e.keyCode === 27) {
            hideLightbox();
        }
        if (e.keyCode === 37) {
            prevImg(e);
        }
        if (e.keyCode === 39) {
            nextImg(e);
        }
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }


    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault);
        window.addEventListener("wheel", preventDefault); // modern standard
        window.addEventListener("mousewheel", preventDefault); // older browsers, IE
        document.addEventListener("mousewheel", preventDefault); // older browsers, IE
        window.addEventListener("touchmove", preventDefault); // mobile
    }

    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault);
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("mousewheel", preventDefault);
        document.removeEventListener("mousewheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
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
        orderFormContainer = document.querySelector(".order-form-container"),
        orderForm = document.getElementById("order-form"),
        formInputs = document.querySelectorAll(".order-form input, .order-form textarea"),
        formSubmit = document.getElementById("order-submit-pay"),
        paymentInputs = document.getElementsByName("paymentType"),
        orderSuccess = document.querySelector(".order-success");

    var option, product, amount;

    next.addEventListener("click", changePriceItem.bind(this, false));
    prev.addEventListener("click", changePriceItem.bind(this, true));

    for (var i = 0; i < orderButtons.length; i++) {
        orderButtons[i].addEventListener("click", preOrder.bind(this, i));
    }

    for (var i = 0; i < paymentInputs.length; i++) {
        paymentInputs[i].addEventListener("change", paymenTypeChangedHandler);
    }

    cancelOrderBtn.addEventListener("click", cancelOrder);
    document.getElementById("order-close").addEventListener("click", closeOrder);

    formSubmit.addEventListener("click", order);

    function changePriceItem(prev) {
        for (var i = 0; i < priceItems.length; i++) {
            var item = priceItems[i];
            if (item.classList.contains("active")) {
                item.classList.remove("active");
                var nextIndex;
                if (prev) {
                    nextIndex = (i - 1) < 0 ? priceItems.length - 1 : i - 1;
                } else {
                    nextIndex = (i + 1) >= priceItems.length ? 0 : i + 1;
                }
                priceItems[nextIndex].classList.add("active");
                return;
            }
        }
        priceItems[0].classList.add("active");
    }

    function preOrder(_option) {
        // alert("Опция заказа с сайта пока не доступна");
        // return;
        price.classList.add("hidden");
        orderFormContainer.classList.add("show");
        option = _option;
        document.getElementById("order-product").innerHTML = products[option];
        product = products[option];
        amount = amounts[option];
    }

    function cancelOrder(e) {
        e.preventDefault();
        price.classList.remove("hidden");
        orderFormContainer.classList.remove("show");
        orderSuccess.classList.remove("show");
    }

    function closeOrder(e) {
        cancelOrder(e);
        clearForm(orderForm);
    }

    function paymenTypeChangedHandler(e) {
        if (this.value === "cash") {
            document.getElementById("payment-logo").classList.add("hidden");
        } else {
            document.getElementById("payment-logo").classList.remove("hidden");
        }
    }

    function order(e) {
        if (orderForm.checkValidity()) {
            e.preventDefault();
            var formData = parseForm(orderForm); // new FormData(orderForm);
            // if (formData.paymentType === "online") {
            //     return showNotification("Оплата банковской картой пока не принимается. Просим прощения за неудобства.");
            // }
            formData.product = option + "";
            formSubmit.setAttribute("disabled", true);
            sendOrder(formData, function (err, orderId) {
                formSubmit.removeAttribute("disabled");
                console.log("Err", err);
                if (err != null) {
                    showNotification(orderErrorText, true);
                } else {
                    document.getElementById("pricing").scrollIntoView();
                    orderFormContainer.classList.remove("show");
                    orderSuccess.classList.add("show");
                    orderSuccess.children[0].innerHTML = acceptedText.replace("{{orderId}}", orderId);
                    orderSuccess.children[1].innerHTML = "<p><b>" + product + "</b></p>";
                    if (formData.paymentType === "online") {
                        document.getElementById("order-close").setAttribute("disabled", true);
                        var s = 6;
                        var interval = setInterval(function () {
                            if (s > 0) {
                                s--;
                                orderSuccess.children[2].innerHTML = waitPaymentFormText.replace("{{s}}", s);
                                if (s < 2) {
                                    makePaymentWithWidget(amount, orderId, "- " + product);
                                }
                            } else {
                                clearInterval(interval);
                                document.getElementById("order-close").removeAttribute("disabled");
                                orderSuccess.children[2].innerHTML = successText;
                            }
                        }, 1000);
                    } else {
                        orderSuccess.children[2].innerHTML = successText;
                    }
                }
            })
        }
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

function parseForm(form) {
    var res = {};
    for (var i = 0; i < form.elements.length; i++) {
        if (!form.elements[i].name) {
            continue;
        }
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'text':
                    case 'tel':
                    case 'email':
                        res[form.elements[i].name] = form.elements[i].value;
                        break;
                    case 'checkbox':
                        res[form.elements[i].name] = !!form.elements[i].checked;
                        break;
                    case 'radio':
                        if (form.elements[i].checked) {
                            res[form.elements[i].name] = form.elements[i].value;
                        }
                        break;
                }
                break;
            case 'TEXTAREA':
            case 'SELECT':
                res[form.elements[i].name] = form.elements[i].value;
                break;
        }
    }
    return res;
}

function clearForm(form) {
    var res = {};
    for (var i = form.elements.length - 1; i >= 0; i--) {
        if (!form.elements[i].name) {
            continue;
        }
        var r = [];
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'checkbox':
                        form.elements[i].checked = false;
                        break;
                    case 'radio':
                        // if (r.indexOf(form.elements[i].name) < 0) {
                        //     r.push(form.elements[i].name);
                        //     form.elements[i].checked = true;
                        // } else {
                        //     form.elements[i].checked = false;
                        // }
                        break;
                    default:
                        form.elements[i].value = "";
                        break;
                }
                break;
            case 'TEXTAREA':
            case 'SELECT':
                form.elements[i].value = "";
                break;
        }
    }
    return res;
}

function sendOrder(data, cb) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var res;
                try {
                    res = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    console.error("Order error:", e);
                    cb(500, null);
                    return;
                }
                cb(null, res);
            } else {
                cb(xhr.status, null);
            }
        }
    });

    xhr.open('POST', 'http://api.checkintmn.ru/hooks/orders/make-order');
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("data=" + JSON.stringify(data));
}

function showNotification(text, error) {
    var container = document.getElementById("notifications");
    var n = document.createElement("div");
    n.className = "notification" + (error ? " error" : "");
    n.innerHTML = "<div>" + text + "</div>";
    container.appendChild(n);
    setTimeout(function () {
        n.classList.add("show");
        setTimeout(function () {
            n.classList.remove("show");
            setTimeout(function () {
                container.removeChild(n);
            }, 400);
        }, 5000);
    }, 100);
}