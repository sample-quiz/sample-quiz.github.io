import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js'
import {browsePage} from './views/browse.js'

const main = document.querySelector('#content')

page('/browse', decorateContext, browsePage)
page('/create', decorateContext, editorPage);
page('/edit/:id', decorateContext, editorPage);


page.start();


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    next();

}


import * as api  from './api/data.js';

window.api = api;