import barbaCore from "https://cdn.skypack.dev/@barba/core";
import gsap from "https://cdn.skypack.dev/gsap";

gsap.to(".loader-bar", {
  yPercent: 100,
  stagger: 0.05,
});
handleNavState();

barbaCore.init({
  transitions: [
    {
      name: "opacity-transition",
      leave(data) {
        console.log("leaving");
        return gsap.to(".loader-bar", {
          yPercent: 0,
          stagger: 0.05,
        });
      },
      beforeEnter(data) {
        console.log("before entering");
        handleNavState();
      },
      enter(data) {
        console.log("entering");
        data.current.container.remove();
        return gsap.to(".loader-bar", {
          yPercent: 100,
          stagger: 0.05,
        });
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
