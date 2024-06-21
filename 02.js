import barbaCore from "https://cdn.skypack.dev/@barba/core";
import gsap from "https://cdn.skypack.dev/gsap";

gsap.to(".loader-bar", {
  yPercent: 100,
  stagger: 0.05,
});

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
