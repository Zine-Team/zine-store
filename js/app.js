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

    const nextButtonWide = document.querySelector("[data-action='next-wide']");
    const prevButtonWide = document.querySelector("[data-action='prev-wide']");

    const nextButtonNarrow = document.querySelector("[data-action='next-narrow']");
    const prevButtonNarrow = document.querySelector("[data-action='prev-narrow']");

    const zineTemplate = compile_template("zines/show/zine_pages");

    const pages = [`${zine}/pages/page_cover.jpg`, `${zine}/pages/page_1.jpg`, `${zine}/pages/page_2.jpg`, `${zine}/pages/page_3.jpg`, `${zine}/pages/page_4.jpg`, `${zine}/pages/page_5.jpg`, `${zine}/pages/page_6.jpg`, `${zine}/pages/page_back.jpg`];

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
        lastPage = currentPage;
      };

      let currentSpread = 0;
      let currentPage = 0;
      const totalSpreads = pages.length / 2;
      const totalPages = pages.length;
      const DOMZine = document.querySelector(".zine-inner");
      const DOMPages = document.querySelectorAll(".zine-page");

      function spreadChange(direction) {
        // change the currentSpread number
        currentSpread = currentSpread + 1 * direction;

        // show the current pages
        showSpread(currentSpread);
      }

      function showSpread(spread) {
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

      function pageChange(direction) {
        // increment the current page by 1
        currentPage = currentPage + 1 * direction;
        console.log(currentPage);
        // when the second page in a spread is focused and incremented again, increase the spread.
        if (direction === 1 && (currentPage % 2 === 1 || currentPage === 0)) {
          currentSpread = currentSpread + 1;
          showSpread(currentSpread);
          //   or, when the first page in a spread is focused and decremented again, decrease the spread
        } else if (direction === -1 && currentPage % 2 === 0) {
          currentSpread = currentSpread - 1;
          showSpread(currentSpread);
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

      //   wide screens navigation events
      nextButtonWide.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread < totalSpreads) {
          spreadChange(1);
        }
      });

      prevButtonWide.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread > 0) {
          spreadChange(-1);
        }
      });

      //   narrow screens navigation events
      nextButtonNarrow.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread < totalSpreads) {
          pageChange(1);
        }
      });

      prevButtonNarrow.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentSpread > 0) {
          pageChange(-1);
        }
      });

      showSpread(0);
    });
  };

  route();
}
