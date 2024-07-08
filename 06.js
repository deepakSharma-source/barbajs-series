import barbaCore from "https://cdn.skypack.dev/@barba/core";
import gsap from "https://cdn.skypack.dev/gsap";
import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

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
  console.log("handleNavState");
  const navLinks = document.querySelectorAll(".navbar_link");
  navLinks.forEach((link) => {
    link.classList.remove("is-active");
  });
  const currentPath = window.location.pathname;
  const activeLink = document.querySelector(`a[href="${currentPath}"]`);
  activeLink.classList.add("is-active");
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
