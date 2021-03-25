import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js'

const main = document.querySelector('#content')

page('/', decorateContext, editorPage);

page.start();


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    next();

}