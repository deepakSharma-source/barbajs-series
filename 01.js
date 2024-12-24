import barbaCore from "https://cdn.skypack.dev/@barba/core";
import gsap from "https://cdn.skypack.dev/gsap";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";
import Flip from "https://cdn.skypack.dev/gsap/Flip";

gsap.registerPlugin(Flip);

gsap.to(".loader-bar", {
  yPercent: 100,
  stagger: 0.05,
});
handleNavState();

barbaCore.init({
  transitions: [
    {
      name: "loader-bars-transition",
      leave(data) {
        return gsap.to(".loader-bar", {
          yPercent: 0,
          stagger: 0.05,
        });
      },
      enter(data) {
        data.current.container.remove();
        return gsap.to(".loader-bar", {
          yPercent: 100,
          stagger: 0.05,
        });
      },
    },
    {
      name: "posts_posts-template_flip",
      from: {
        namespace: ["posts"],
      },
      to: {
        namespace: ["posts-template"],
      },
      enter(data) {
        handlePostsToPostTemplateTransition(data);
      },
    },
  ],
  views: [
    {
      namespace: "about",
      beforeEnter(data) {
        handleNavState();
        handleInitAboutSlider();
        restartWebflow(data.next.html);
      },
    },
    {
      namespace: "home",
      beforeEnter(data) {
        handleNavState();
        restartWebflow(data.next.html);
      },
    },
    {
      namespace: "posts",
      beforeEnter(data) {
        handleNavState();
        restartWebflow(data.next.html);
      },
    },
    {
      namespace: "posts-template",
      beforeEnter(data) {
        handleNavState();
        restartWebflow(data.next.html);
      },
    },
  ],
});

function handleNavState() {
  const navLinks = document.querySelectorAll(".navbar_link");
  navLinks.forEach((link) => {
    link.classList.remove("w--current");
  });
  const currentPath = window.location.pathname;
  const activeLink = document.querySelector(`a[href="${currentPath}"]`);

  if (!activeLink) return;

  activeLink.classList.add("w--current");
}

function handleInitAboutSlider() {
  const swiper = new Swiper(".wb-swiper", {
    slideClass: "wb-swiper_slide",
    wrapperClass: "wb-swiper_wrapper",
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },
    pagination: {
      el: ".wb-swiper_pagination",
      bulletClass: "wb-swiper_bullet",
      bulletActiveClass: "is-active",
      clickable: true,
    },
    navigation: {
      nextEl: `[wb-swiper="next"]`,
      prevEl: `[wb-swiper="previous"]`,
    },
    breakpoints: {
      480: {
        slidesPerView: "auto",
        spaceBetween: 36,
      },
      320: {
        slidesPerView: "auto",
        spaceBetween: 12,
      },
    },
  });
}

function restartWebflow(htmlString) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, "text/html");
  const pageId = dom
    .querySelector("[data-wf-page]")
    .getAttribute("data-wf-page");

  console.log({ pageId });

  document.querySelector("html").setAttribute("data-wf-page", pageId);

  // Reinitialize webflow modules
  Webflow.destroy();
  Webflow.ready();
  Webflow.require("ix2").init();
}

function handlePostsToPostTemplateTransition(data) {
  const nextContainer = data.next.container;
  const currentContainer = data.current.container;

  // overlay next container over current container
  nextContainer
    .querySelector(".main-wrapper_inner")
    .classList.add("in-transition");

  // Get the current image (posts), next image (post-template), and target container
  const target = data.event.target;
  const currentImage = target
    .closest(".posts_link")
    .querySelector(".posts_image");
  const imageContainer = nextContainer.querySelector(".post_image_wrapper");
  const nextImage = imageContainer.querySelector(".post_image");

  // Hide the next image
  gsap.set(nextImage, { opacity: 0 });

  // Record the state of current image
  const state = Flip.getState(currentImage);

  // Append the current image to the target container
  imageContainer.appendChild(currentImage);

  // Remove the current container so only content on post detail page is visible
  currentContainer.remove();

  // Scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  // Apply the flip animation
  return Flip.from(state, {
    duration: 0.5,
    ease: "power1.inOut",
    absolute: true,
    onComplete: () => {
      // Reset
      nextContainer
        .querySelector(".main-wrapper_inner")
        .classList.remove("in-transition");
    },
  });
}

