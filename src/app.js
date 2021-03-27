import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js';
import {browsePage} from './views/browse.js';
import {homePage} from './views/home.js';
import {signIn, signUp} from './views/signIn.js'
import { logout } from './api/data.js';
import { quizPage } from './views/quiz/quiz.js';


const main = document.querySelector('#content')

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await logout();
    setUserNav();
    page.redirect('/');
})

page('/', decorateContext, homePage);
page('/browse', decorateContext, browsePage);
page('/create', decorateContext, editorPage);
page('/edit/:id', decorateContext, editorPage);
page('/quiz/:id', decorateContext, quizPage);
page('/signIn', decorateContext, signIn);
page('/signUp', decorateContext, signUp);


setUserNav();
page.start();


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;
    next();

}


function setUserNav() {
    const userId = sessionStorage.getItem('userId');
    if(userId != null) {
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}
