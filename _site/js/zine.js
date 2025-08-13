const nextButtonsWide = document.querySelectorAll("[data-action='next-wide']");
const prevButtonsWide = document.querySelectorAll("[data-action='prev-wide']");

const nextButtonsNarrow = document.querySelectorAll("[data-action='next-narrow']");
const prevButtonsNarrow = document.querySelectorAll("[data-action='prev-narrow']");

let currentSpread = 0;
let currentPage = 0;
const DOMZineOuter = document.querySelector("[data-zine-part='outer']");
const DOMZine = document.querySelector("[data-zine-part='spread']");
const DOMPages = document.querySelectorAll("[data-zine-part='page']");
const totalSpreads = DOMPages.length / 2;
const totalPages = DOMPages.length;

function changeSpread(direction) {
  // change the currentSpread number
  currentSpread = currentSpread + 1 * direction;

  // show the current pages
  showSpread(currentSpread, direction);
}

function showSpread(spread, direction) {
  const leftPage = DOMPages[spread * 2 - 1];
  const rightPage = DOMPages[spread * 2];

  // set data attribute for direction
  if (direction === -1) {
    DOMZine.dataset.direction = "decrement";
  } else {
    DOMZine.dataset.direction = "increment";
  }

  // hide previous pages
  DOMPages.forEach((page) => {
    page.classList.remove("animatingOut", "animatingIn");
    if (page.classList.contains("visible")) {
      page.classList.remove("visible");
      page.classList.add("animatingOut");
    }
  });

  // show right page
  if (rightPage) {
    rightPage.classList.add("visible");
    rightPage.classList.add("animatingIn");
  }

  // show left page
  if (leftPage) {
    leftPage.classList.add("visible");
    leftPage.classList.add("animatingIn");
  }

  // center align (or not) the shown pages
  if (currentSpread === 0) {
    DOMZine.classList.add("front-cover");
  } else if (currentSpread === totalSpreads) {
    DOMZine.classList.add("back-cover");
  } else {
    DOMZine.classList.remove("front-cover", "back-cover");
  }
}

function changePage(direction) {
  // increment the current page by 1
  currentPage = currentPage + 1 * direction;
  // when the second page in a spread is focused and incremented again, increase the spread.
  if (direction === 1 && (currentPage % 2 === 1 || currentPage === 0)) {
    currentSpread = currentSpread + 1;
    showSpread(currentSpread, direction);
    //   or, when the first page in a spread is focused and decremented again, decrease the spread
  } else if (direction === -1 && currentPage % 2 === 0) {
    currentSpread = currentSpread - 1;
    showSpread(currentSpread, direction);
  }

  showPages(currentPage);
}

function showPages(page) {
  if (page % 2 === 0) {
    DOMZine.classList.add("right");
  } else {
    DOMZine.classList.remove("right");
  }
}

// wide screens navigation events
nextButtonsWide.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSpread < totalSpreads) {
      changeSpread(1);
    }
  });
});

prevButtonsWide.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSpread > 0) {
      changeSpread(-1);
    }
  });
});

// narrow screens navigation events
nextButtonsNarrow.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSpread < totalSpreads) {
      changePage(1);
    }
  });
});

prevButtonsNarrow.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentSpread > 0) {
      changePage(-1);
    }
  });
});

showSpread(0);

const mq = window.matchMedia("(prefers-reduced-motion: no-preference)");

if (mq.matches) {
  document.addEventListener("mousemove", function (event) {
    const aimX = (event.pageX - window.innerWidth / 2) / 100;
    const aimY = (event.pageY - window.innerHeight / 2) / -100;
    DOMZineOuter.style.setProperty("--aimX", `${aimX}`);
    DOMZineOuter.style.setProperty("--aimY", `${aimY}`);
  });
}
