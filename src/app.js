import { page, render } from './lib.js';
import { editorPage } from './views/editor/editor.js';
import { browsePage } from './views/browse.js';
import { homePage } from './views/home.js';
import { signIn, signUp } from './views/signIn.js'
import { getQuestionByQuizId, getQuizById, logout } from './api/data.js';
import { quizPage } from './views/quiz/quiz.js';
import {cubeLoader} from './views/common/loader.js';
import { result } from './views/quiz/result.js';
import { details } from './views/details.js';
import { profile } from './views/profile.js';

const state = {};
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
page('/quiz/:id', decorateContext,  quizPage);
page('/details/:id', decorateContext,  details);
page('/profile/:userId', decorateContext,  profile);
page('/result/:id', decorateContext, result);
page('/signIn', decorateContext, signIn);
page('/signUp', decorateContext, signUp);


setUserNav();
page.start();

async function getQuiz(ctx, quizId) {
    ctx.clearCache = clearCache;
    
    if (state[quizId] == undefined) {
        ctx.render(cubeLoader());
        state[quizId] = await getQuizById(quizId);
        const ownerId = state[quizId].owner.objectId;
        state[quizId].questions = await getQuestionByQuizId(quizId, ownerId);
        state[quizId].answers = state[quizId].questions.map(q => undefined);
    }
    
    
}

function clearCache (quizId) {
    if(state[quizId]){
        delete state[quizId];
    }
}


async function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, main);
    ctx.setUserNav = setUserNav;

    const quizId = ctx.params.id;
    
    if(quizId != undefined) {
        await getQuiz(ctx, quizId)
        ctx.quiz = state[quizId];
    }
    next();

}


function setUserNav() {
    const userId = sessionStorage.getItem('userId');
    if (userId != null) {
        document.querySelector('.nav-link.profile-link').href = `/profile/${userId}`;
        document.getElementById('user-nav').style.display = 'block';
        document.getElementById('guest-nav').style.display = 'none';
    } else {
        document.getElementById('user-nav').style.display = 'none';
        document.getElementById('guest-nav').style.display = 'block';
    }
}
