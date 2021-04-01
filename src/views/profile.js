import { get } from '../api/api.js';
import { deleteQuestion, deleteQuiz, getProfileById, getQuestionByQuizId, getQuizById, getQuizByOwnerId, getQuizes, getSolutionsByUserId } from '../api/data.js';
import { html, until } from '../lib.js';
import { cubeLoader } from './common/loader.js';

const template = (username, email, userId) => html`
<section id="profile">
    <header class="pad-large">
        <h1>Profile Page</h1>
    </header>

    <div class="hero pad-large">
        <article class="glass pad-large profile">
            <h2>Profile Details</h2>
            <p>
                <span class="profile-info">Username:</span>
                ${username}
            </p>
            ${email ? html`<p>
                <span class="profile-info">Email:</span>
                ${email}
            </p>` : ''}
            <h2>${email ? html`Your` : ''} Quiz Results</h2>
            <table class="quiz-results">
                <tbody>
                    ${until(loadResults(userId), cubeLoader())}
                </tbody>
            </table>
        </article>
    </div>
    ${email ? html`
    <header class="pad-large">
        <h2>Quizes created by you</h2>
    </header>

    <div class="pad-large alt-page">

        ${until(loadQuizes(userId), cubeLoader())}

    </div>` : ''}
    

</section>`;

async function loadQuizes (userId) {
    if(userId == undefined){
        userId = sessionStorage.getItem('userId');
    }
    const quizes = await getQuizByOwnerId(userId);
   return quizes.map(quizTemplate); 
}

const quizTemplate = (quiz) => html`
<article class="preview layout">
    <div class="right-col">
        <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
        <a class="action cta" href="/edit/${quiz.objectId}"><i class="fas fa-edit"></i></a>
        <a @click=${()=> onDelete(quiz.objectId, quiz.owner.objectId)} class="action cta" href="javascript:void(0)"><i
                class="fas fa-trash-alt"></i></a>
    </div>
    <div class="left-col">
        <h3><a class="quiz-title-link" href="/details/${quiz.objectId}">${quiz.title}</a></h3>
        <span class="quiz-topic">Topic: ${quiz.topic}</span>
        <div class="quiz-meta">
            ${quiz.questionCount > 0 ? html`<span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' :
        's'}</span>` : ''}
            <!-- <span>|</span>
            <span>Taken 54 times</span> -->
        </div>
    </div>
</article>`

async function onDelete(quizId, ownerId) {

    const quizQuestions = await getQuestionByQuizId(quizId, ownerId);
    quizQuestions.forEach(async (q) => {
        await deleteQuestion(q.objectId);
    });
    await deleteQuiz(quizId);

    
}

async function loadResults(userId) {
    if(userId == undefined) {
        userId = sessionStorage.getItem('userId');
    }
    const quizResults = await getSolutionsByUserId(userId);
    const quizes = await getQuizes();

    if (quizResults.length > 0) {

        return quizResults.map((r, i) => {
            const quiz = quizes.find(q => q.objectId == r.quiz.objectId)
            const percent = (r.correct / r.total * 100).toFixed(0)
            

            return resultTemplate(r, quiz, percent);
        })


    } else {
        return html``
    }

}

const resultTemplate = (result, quiz, percent) => html`
<tr class="results-row">
    <td class="cell-1">${result.createdAt.split('T')[0].replaceAll('-', ' ')}</td>
    <td class="cell-2"><a href="/quiz/${quiz.objectId}">${quiz.title}</a></td>
    <td class="cell-3 s-correct">${percent}%</td>
    <td class="cell-4 s-correct">${result.correct}/${result.total} correct answers</td>
</tr>`

export async function profile(ctx) {
    const userId = sessionStorage.getItem('userId');
    const profileId = ctx.params.userId;
    
    const isOwner = userId == profileId;
    
    if(isOwner) {
        const email = sessionStorage.getItem('email');
        const username = sessionStorage.getItem('username');
        ctx.render(template(username, email));
    } else {
        const email = undefined
        const profile = await getProfileById(profileId);
        
        ctx.render(template(profile.username, email, profile.objectId));
    }

}


