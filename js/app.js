function App(view) {
    const params = new URLSearchParams(window.location.search);

    const select = document.querySelectorAll;

    const route = () => {
        const routes = {
            "index": render_index,
            "zines/show": render_zines_show
        }

        if (routes[view]) {
            routes[view].call();
        }
    };

    async function compile_template(template_name, params) {
        const response = await fetch("../templates/"+template_name+".html_");
        const template_text = await response.text();
        const template = Handlebars.compile(template_text)

        return template(params);
    }

    async function get_directory(path) {
        const response = await fetch(path);
        const template_text = await response.text();
        return template_text;
    }

    get_directory("http://127.0.0.1:8080/zines").then(console.log)

    const render_template = (template_name, target_node, params) => {
        compile_template(template_name, params).then((template) => {
            target_node.innerHTML = template;
            return target_node;
        })
    }

    const render_index = () => {

    };

    const render_zines_show = () => {
        const root = document.querySelector("[data-template='root']");
        render_template("zines/show", root, {
            coverUrl: "congo/pages/page_cover.jpg"
        });
        console.log(root)
    }

    document.onread
    route();
}

