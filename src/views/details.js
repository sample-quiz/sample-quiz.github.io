import { getQuizById } from '../api/data.js';
import { html } from '../lib.js';


const template = (quiz, user) => html`
<section id="details">
    <div class="pad-large alt-page">
        <article class="details">
            <h1>${quiz.title}</h1>
            <span class="quiz-topic">A quiz by <a href="/profile/${quiz.owner.objectId}">${quiz.owner.username}</a> on the topic of
                ${quiz.topic}</span>
            <div class="quiz-meta">
                ${quiz.questionCount > 0 ? html`<span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' :
                    's'}</span>` : ''}
                <!-- <span>|</span>
                <span>Taken 189 times</span> -->
            </div>
            <p class="quiz-desc">${quiz.description}</p>

            ${user ? html`
            <div>
                <a class="cta action" href="/quiz/${quiz.objectId}">Begin Quiz</a>
            </div>` : ''}

        </article>
    </div>
</section>`


export async function details(ctx) {
    const userId = sessionStorage.getItem('userId');
    const quizId = ctx.params.id;
    const quiz = await getQuizById(quizId)
    ctx.render(template(quiz, userId))
}