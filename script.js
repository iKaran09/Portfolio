// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations with better performance
  initAnimations();

  // Initialize contact form with validation
  initContactForm();

  // Handle smooth scrolling to sections
  initSmoothScroll();

  // Make all animation elements visible initially on mobile
  if (window.innerWidth < 768) {
    makeAllElementsVisible();
  }
});

/**
 * Initialize animations for elements with better performance
 */
function initAnimations() {
  // Get all elements to animate on scroll
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .fade-in-left, .fade-in-right"
  );

  // Create an Intersection Observer with optimized options
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animated class with a slight delay for staggered effect
          setTimeout(() => {
            entry.target.classList.add("animated");
          }, 100);

          // Stop observing after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  // Observe each element
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Animate hero section elements immediately for better user experience
  const heroElements = document.querySelectorAll(".hero-stagger");
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300 + index * 150); // More natural staggered timing
  });

  // Add smooth parallax effect to decorative elements with reduced sensitivity
  window.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005; // Reduced motion
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;

    document.querySelectorAll(".decor-element").forEach((element) => {
      const speedX = element.getAttribute("data-speed-x") || 1;
      const speedY = element.getAttribute("data-speed-y") || 1;

      element.style.transform = `translate(${moveX * speedX}px, ${
        moveY * speedY
      }px)`;
    });
  });
}

/**
 * Make all animation elements visible on mobile for better performance
 */
function makeAllElementsVisible() {
  const animationElements = document.querySelectorAll(
    ".animate-on-scroll, .fade-in-left, .fade-in-right, .hero-stagger"
  );

  animationElements.forEach((el) => {
    el.classList.add("animated");
    el.style.opacity = "1";
    el.style.transform = "translate(0, 0)";
  });
}

/**
 * Initialize contact form with validation and submission handling
 */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  // Ensure the form actually exists before adding listeners
  if (contactForm) {
    // Fix form visibility issues immediately
    contactForm.style.opacity = "1";
    contactForm.style.transform = "translateY(0)";

    // Add form submission handler
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Simple validation
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      if (!name || !email || !subject || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Here you would typically send the form data to your backend
      // For this demo, we'll just show a success message
      showNotification("Your message has been sent successfully!", "success");
      contactForm.reset();
    });

    // Add focus states for better UX
    const formInputs = contactForm.querySelectorAll("input, textarea");
    formInputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });
    });
  }
}

/**
 * Add smooth scrolling to navigation links with optimized performance
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Make sure contact section is visible when scrolling to it
        if (targetId === "#contact") {
          const contactSection = document.querySelector("#contact");
          if (contactSection) {
            contactSection.style.opacity = "1";
            const contactForm = contactSection.querySelector("form");
            if (contactForm) {
              contactForm.style.opacity = "1";
              contactForm.style.transform = "translateY(0)";
            }
          }
        }

        // Use Lenis for smooth scrolling
        lenis.scrollTo(targetElement, {
          offset: -80, // Reduced offset for better view
          duration: 1.0, // Slightly faster for better response
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu");
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    });
  });

  // Update active link based on scroll position
  window.addEventListener("scroll", updateActiveLink);
}

/**
 * Update active link based on scroll position
 */
function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      document.querySelectorAll("nav a").forEach((link) => {
        link.classList.remove("text-accent");
        if (link.getAttribute("href") === "#" + sectionId) {
          link.classList.add("text-accent");
        }
      });
    }
  });
}

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Show a notification message with improved UI
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error)
 */
function showNotification(message, type) {
  // Remove any existing notifications
  const existingNotifications = document.querySelectorAll(
    ".notification-toast"
  );
  existingNotifications.forEach((notification) => {
    notification.remove();
  });

  // Create notification element
  const notification = document.createElement("div");
  notification.classList.add(
    "notification-toast",
    "fixed",
    "bottom-4",
    "right-4",
    "px-6",
    "py-3",
    "rounded-lg",
    "text-white",
    "shadow-lg",
    "z-50",
    "flex",
    "items-center",
    "gap-2"
  );

  // Set color and icon based on type
  if (type === "success") {
    notification.classList.add("bg-green-500");
    notification.innerHTML = `
      <span class="material-icons text-sm">check_circle</span>
      <span>${message}</span>
    `;
  } else {
    notification.classList.add("bg-red-500");
    notification.innerHTML = `
      <span class="material-icons text-sm">error</span>
      <span>${message}</span>
    `;
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateY(0)";
    notification.style.opacity = "1";
  }, 10);

  // Remove after 4 seconds (faster for better UX)
  setTimeout(() => {
    notification.style.transform = "translateY(10px)";
    notification.style.opacity = "0";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}
