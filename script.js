// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


// ============================================================
// HAMBURGER MENU (mobile)
// ============================================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}


// ============================================================
// HERO PARALLAX — only on index.html (safe null check)
// ============================================================

const hero = document.querySelector(".hero");

if (hero) {
  window.addEventListener("scroll", function () {
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPositionY = scrollPosition * 0.4 + "px";
  });
}


// ============================================================
// REVEAL ANIMATION ON SCROLL
// ============================================================

const revealElements = document.querySelectorAll(
  ".gallery-card, .feed-article, .registry-card, .vm-card, .council-card, .timeline-entry"
);

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach(function (el, index) {
    const elTop = el.getBoundingClientRect().top;

    if (elTop < triggerBottom) {
      // Stagger delay based on position in list
      setTimeout(function () {
        el.classList.add("show");
      }, (index % 4) * 80);
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// ============================================================
// BUTTON RIPPLE EFFECT — fixed with getBoundingClientRect
// ============================================================

const rippleButtons = document.querySelectorAll(
  ".primary-btn, .join-btn, .submit-btn, .load-more-btn"
);

rippleButtons.forEach(function (button) {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    this.appendChild(ripple);

    // Fixed: use getBoundingClientRect for accurate positioning
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.left = x + "px";
    ripple.style.top = y + "px";

    setTimeout(function () {
      ripple.remove();
    }, 600);
  });
});


// ============================================================
// TROOPS FILTER (troops.html only)
// ============================================================

const troopSearch = document.getElementById("troopSearch");
const rarityFilter = document.getElementById("rarityFilter");
const roleBtns = document.querySelectorAll(".role-btn");
const troopCards = document.querySelectorAll(".troop-fullbleed-card");

let activeRole = "all";

if (roleBtns.length > 0) {
  roleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      roleBtns.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      activeRole = this.getAttribute("data-role");
      filterTroops();
    });
  });
}

if (rarityFilter) {
  rarityFilter.addEventListener("change", filterTroops);
}

if (troopSearch) {
  troopSearch.addEventListener("input", filterTroops);
}

function filterTroops() {
  const searchVal = troopSearch ? troopSearch.value.toLowerCase() : "";
  const rarityVal = rarityFilter ? rarityFilter.value : "all";

  troopCards.forEach(function (card) {
    const cardRole    = card.getAttribute("data-role");
    const cardRarity  = card.getAttribute("data-rarity");
    const cardName    = card.getAttribute("data-name").toLowerCase();

    const matchRole   = (activeRole === "all") || (cardRole === activeRole);
    const matchRarity = (rarityVal === "all") || (cardRarity === rarityVal);
    const matchSearch = cardName.includes(searchVal);

    if (matchRole && matchRarity && matchSearch) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}


// ============================================================
// REGISTER FORM VALIDATION — 5 validations, no regex
// ============================================================

const submitBtn = document.getElementById("submitBtn");

if (submitBtn) {
  submitBtn.addEventListener("click", function () {
    let isValid = true;

    // Clear previous errors
    clearErrors();

    // 1. Full Name: must not be empty and must be at least 3 chars
    const fullName = document.getElementById("fullName");
    if (fullName) {
      const nameVal = fullName.value.trim();
      if (nameVal.length === 0) {
        showError("fullNameErr", "Full name is required.");
        fullName.classList.add("input-error");
        isValid = false;
      } else if (nameVal.length < 3) {
        showError("fullNameErr", "Name must be at least 3 characters.");
        fullName.classList.add("input-error");
        isValid = false;
      }
    }

    // 2. Email: must not be empty and must contain @ and a dot after @
    const emailAddr = document.getElementById("emailAddr");
    if (emailAddr) {
      const emailVal = emailAddr.value.trim();
      const atIndex = emailVal.indexOf("@");
      const dotAfterAt = emailVal.indexOf(".", atIndex);

      if (emailVal.length === 0) {
        showError("emailErr", "Email address is required.");
        emailAddr.classList.add("input-error");
        isValid = false;
      } else if (atIndex === -1 || dotAfterAt === -1 || dotAfterAt === emailVal.length - 1) {
        showError("emailErr", "Please enter a valid email address.");
        emailAddr.classList.add("input-error");
        isValid = false;
      }
    }

    // 3. Gender: one radio must be selected
    const genderRadios = document.querySelectorAll("input[name='gender']");
    let genderSelected = false;
    genderRadios.forEach(function (radio) {
      if (radio.checked) { genderSelected = true; }
    });
    if (!genderSelected) {
      showError("genderErr", "Please select your gender.");
      isValid = false;
    }

    // 4. Age: must not be empty, must be a number, and between 13 and 99
    const ageInput = document.getElementById("ageInput");
    if (ageInput) {
      const ageVal = ageInput.value.trim();
      const ageNum = Number(ageVal);
      if (ageVal.length === 0) {
        showError("ageErr", "Age is required.");
        ageInput.classList.add("input-error");
        isValid = false;
      } else if (isNaN(ageNum) || ageNum !== Math.floor(ageNum)) {
        showError("ageErr", "Please enter a valid age.");
        ageInput.classList.add("input-error");
        isValid = false;
      } else if (ageNum < 13 || ageNum > 99) {
        showError("ageErr", "Age must be between 13 and 99.");
        ageInput.classList.add("input-error");
        isValid = false;
      }
    }

    // 5. Favorite Troop: must not be the default placeholder
    const favTroop = document.getElementById("favTroop");
    if (favTroop) {
      if (favTroop.value === "" || favTroop.value === "SELECT SPECIALIZATION") {
        showError("troopErr", "Please select your favorite troop.");
        favTroop.classList.add("input-error");
        isValid = false;
      }
    }

    // 6. Reason to Join: must not be empty and at least 10 chars
    const reasonJoin = document.getElementById("reasonJoin");
    if (reasonJoin) {
      const reasonVal = reasonJoin.value.trim();
      if (reasonVal.length === 0) {
        showError("reasonErr", "Please state your reason to join.");
        reasonJoin.classList.add("input-error");
        isValid = false;
      } else if (reasonVal.length < 10) {
        showError("reasonErr", "Reason must be at least 10 characters.");
        reasonJoin.classList.add("input-error");
        isValid = false;
      }
    }

    // If all valid, show success
    if (isValid) {
      const successMsg = document.getElementById("successMsg");
      if (successMsg) {
        successMsg.style.display = "block";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.6";
      }
    }
  });
}

function showError(id, message) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = message;
    el.style.display = "block";
  }
}

function clearErrors() {
  var errorSpans = document.querySelectorAll(".field-error");
  errorSpans.forEach(function (span) { span.textContent = ""; span.style.display = "block"; });

  const errorInputs = document.querySelectorAll(".input-error");
  errorInputs.forEach(function (input) { input.classList.remove("input-error"); });

  const successMsg = document.getElementById("successMsg");
  if (successMsg) { successMsg.style.display = "none"; }

  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = "1"; }
}


// ============================================================
// GAME UPDATES CAROUSEL (index.html)
// ============================================================

var carouselTrack = document.querySelector(".carousel-track");

if (carouselTrack) {
  var slides = document.querySelectorAll(".carousel-slide");
  var dots   = document.querySelectorAll(".carousel-dot");
  var prevBtn = document.getElementById("carousel-prev");
  var nextBtn = document.getElementById("carousel-next");
  var currentSlide = 0;
  var autoTimer;

  function goToSlide(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function startAuto() {
    autoTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToSlide(currentSlide - 1);
      resetAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToSlide(currentSlide + 1);
      resetAuto();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      goToSlide(i);
      resetAuto();
    });
  });

  startAuto();
}
