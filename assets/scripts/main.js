const showMenu = () => {
  const menuBtn = document.querySelector(".js-header-nav-burger");
  const menuContainer = document.querySelector(".js-mobile-menu");
  const closeBtn = document.querySelector(".js-mobile-menu-close");
  const body = document.body;

  if (!menuBtn || !menuContainer || !closeBtn) return;

  const openMenu = () => {
    menuContainer.style.transform = "translateX(0)";
    menuContainer.style.visibility = "visible";
    body.classList.add("fixed");
  };

  const hideMenu = () => {
    menuContainer.style.transform = "translateX(100%)";
    menuContainer.style.visibility = "hidden";
    body.classList.remove("fixed");
  };

  menuBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", hideMenu);
};

const initScrollBtn = () => {
  const scrollBtn = document.querySelector(".js-hero-scroll-btn");

  if (!scrollBtn) return;

  scrollBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const target = document.querySelector("#intro");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  showMenu();
  initScrollBtn();
});