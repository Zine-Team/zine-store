function App(view) {
  const params = new URLSearchParams(window.location.search);

  const select = document.querySelectorAll;

  var pathPrefix = null;

  const route = () => {
    const routes = {
      index: {
        render: render_index,
        pathPrefix: ".",
      },
      "zines/show": {
        render: render_zines_show,
        pathPrefix: "..",
      },
    };

    if (routes[view]) {
      pathPrefix = routes[view].pathPrefix;
      routes[view].render.call(routes[view]);
    }
  };

  async function get_text_file(path) {
    const response = await fetch(pathPrefix + path);
    return await response.text();
  }

  async function get_json(path) {
    const response = await fetch(pathPrefix + path);
    return await response.json();
  }

  async function compile_template(template_name) {
    const template_text = await get_text_file(`/templates/${template_name}.hbs`);
    return Handlebars.compile(template_text);
  }

  const render_template = (compiled_template, target_node, params, callback) => {
    return new Promise((resolve, reject) => {
      compiled_template.then((template) => {
        const renderedHtml = template(params);
        target_node.innerHTML = renderedHtml;

        resolve(target_node);
      });
    });
  };

  const appendTemplate = (template_name, target_node, params) => {
    compile_template(template_name, params).then((template) => {
      target_node.innerHTML += template;
      return target_node;
    });
  };

  const render_index = () => {
    const root = document.querySelector("[data-template='root']");

    const zineListTemplate = compile_template("index");

    get_json("/zines/meta.json").then((meta) => {
      render_template(zineListTemplate, root, {
        zines: meta.zines,
      });
    });
  };

  const render_zines_show = () => {
    const zine = params.get("zine");

    const zineRootDom = document.querySelector("[data-template='zine-pages']");

    const nextButton = document.querySelector("[data-action='next']");
    const prevButton = document.querySelector("[data-action='prev']");

    const zineTemplate = compile_template("zines/show/zine_pages");

    const numPages = 8;
    let pages = [
      {
        left: {
          id: "empty",
          side: "left",
          empty: true,
        },
        right: {
          id: "cover",
          pageUrl: `${zine}/pages/page_cover.jpg`,
          side: "center",
        },
      },
      {
        left: {
          id: "1",
          pageUrl: `${zine}/pages/page_1.jpg`,
          side: "left",
        },
        right: {
          id: "2",
          pageUrl: `${zine}/pages/page_2.jpg`,
          side: "right",
        },
      },
      {
        left: {
          id: "3",
          pageUrl: `${zine}/pages/page_3.jpg`,
          side: "left",
        },
        right: {
          id: "4",
          pageUrl: `${zine}/pages/page_4.jpg`,
          side: "right",
        },
      },
      {
        left: {
          id: "5",
          pageUrl: `${zine}/pages/page_5.jpg`,
          side: "left",
        },
        right: {
          id: "6",
          pageUrl: `${zine}/pages/page_6.jpg`,
          side: "right",
        },
      },
      {
        left: {
          id: "empty",
          side: "left",
          empty: true,
        },
        right: {
          id: "back",
          pageUrl: `${zine}/pages/page_back.jpg`,
          side: "center",
        },
      },
    ];

    pages = [`${zine}/pages/page_cover.jpg`, `${zine}/pages/page_1.jpg`, `${zine}/pages/page_2.jpg`, `${zine}/pages/page_3.jpg`, `${zine}/pages/page_4.jpg`, `${zine}/pages/page_5.jpg`, `${zine}/pages/page_6.jpg`, `${zine}/pages/page_back.jpg`];
    const zineLength = pages.length;

    let currentPage = 0;
    let lastPage = 0;

    render_template(zineTemplate, zineRootDom, {
      pages: pages,
    }).then((templateRoot) => {
      const onPageChange = (direction) => {
        if (direction === "next") {
          currentSpread = currentSpread + 1;
        } else if (direction === "prev") {
          currentSpread = currentSpread - 1;
        }

        zineRootDom.style.setProperty("--current-spread", currentSpread);

        // for (let pageNum = 0; pageNum <= 8; pageNum++) {
        //   let id = pageNum;

        //   if (pageNum == 0) {
        //     id = "cover";
        //   } else if (pageNum == 8) {
        //     id = "back";
        //   } else if (pageNum == 7) {
        //     continue;
        //   }

        //   const page = templateRoot.querySelector(`.zine-spread .page-${id}`);

        //   if (currentPage == 0 || currentPage == 8) {
        //     templateRoot.classList.add("cover-view");
        //   } else {
        //     templateRoot.classList.remove("cover-view");
        //   }

        //   page.classList.remove("open", "prev", "next");
        //   if (page.classList.contains("page-side-left") && pageNum >= currentPage) {
        //     page.classList.add("open");
        //   } else if (page.classList.contains("page-side-right") && pageNum >= currentPage) {
        //     page.classList.add("open");
        //   }
        // }

        lastPage = currentPage;
      };

      let currentSpread = 0;
      const totalSpreads = 4;
      const DOMZine = document.querySelector(".zine-inner");
      const DOMPages = document.querySelectorAll(".zine-page");

      function spreadChange(direction) {
        // change the currentSpread number
        currentSpread = currentSpread + 1 * direction;

        // show the current pages
        showPages(currentSpread);
      }

      function showPages(spread) {
        // hide previous pages
        DOMPages.forEach((page) => {
          page.classList.remove("visible");
        });

        // show right page
        if (DOMPages[spread * 2]) {
          DOMPages[spread * 2].classList.add("visible");
        }

        // show left page
        if (DOMPages[spread * 2 - 1]) {
          DOMPages[spread * 2 - 1].classList.add("visible");
        }

        // center align (or not) the shown pages
        if (currentSpread === 0 || currentSpread === totalSpreads) {
          DOMZine.classList.add("closed");
        } else {
          DOMZine.classList.remove("closed");
        }
      }

      nextButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread < totalSpreads) {
          spreadChange(1);
        }
      });

      prevButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread > 0) {
          spreadChange(-1);
        }
      });

      showPages(0);
    });
  };

  route();
}
