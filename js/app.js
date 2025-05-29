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

    const render_template = (template_name, target_node, params) => {
        compile_template(template_name, params).then((template) => {
            target_node.innerHTML = template;
            return target_node;
        })
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

        const root = document.querySelector("[data-template='root']");
        render_template("zines/show", root, {
            coverUrl: `${zine}/pages/page_cover.jpg`
        });
    }

    route();
}

