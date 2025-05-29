function App(view) {
    const params = new URLSearchParams(window.location.search);

    const select = document.querySelectorAll;

    var pathPrefix = null;

    const route = () => {
        const routes = {
            "index": {
                render: render_index,
                pathPrefix: "."
            },
            "zines/show": {
                render: render_zines_show,
                pathPrefix: ".."
            }
        }

        if (routes[view]) {
            pathPrefix = routes[view].pathPrefix;
            routes[view].render.call(routes[view]);
        }
    };

    async function get_text_file(path) {
        const response = await fetch(pathPrefix+path);
        return await response.text();
    }

    async function get_json(path) {
        const response = await fetch(pathPrefix+path);
        return await response.json();
    }

    async function compile_template(template_name, params) {
        const template_text = await get_text_file(`/templates/${template_name}.hbs`);
        const template = Handlebars.compile(template_text)
        return template(params);
    }

    const render_template = (template_name, target_node, params, callback) => {
        return new Promise((resolve, reject) => {
            compile_template(template_name, params).then((template) => {
                target_node.innerHTML = template;
            })
            resolve(target_node);
        });
    }

    const appendTemplate = (template_name, target_node, params) => {
        compile_template(template_name, params).then((template) => {
            target_node.innerHTML += template;
            return target_node;
        })
    }

    const render_index = () => {
        const root = document.querySelector("[data-template='root']");

        get_json("/zines/meta.json").then((meta) => {
            render_template("index", root, {
                zines: meta.zines
            });
        })
    };

    const render_zines_show = () => {
        const zine = params.get("zine");

        const zineDom = document.querySelector("[data-template='zine']");

        const next = document.querySelector("[data-action='next']");
        const prev = document.querySelector("[data-action='prev']");

        let currentPage = 0;

        const render_zine = () => {
            if (currentPage == 0) {
                render_template("zines/show/zine_cover", zineDom, {
                    coverUrl: `${zine}/pages/page_cover.jpg`
                })
            } else if (currentPage == 8) {                
                render_template("zines/show/zine_cover", zineDom, {
                    coverUrl: `${zine}/pages/page_back.jpg`
                })
            } else {    
                render_template("zines/show/zine_open", zineDom, {
                    leftPageUrl: `${zine}/pages/page_${currentPage-1}.jpg`,
                    rightPageUrl: `${zine}/pages/page_${currentPage}.jpg`

                });
            };
        }

        next.addEventListener("click", (e) => {
            if (currentPage < 8) {
                currentPage += 2;
            }
            render_zine();
        });

        prev.addEventListener("click", (e) => {
            if(currentPage > 0) {
                currentPage -= 2;
            }
            render_zine();
        });

        render_zine();
    }

    route();
}

