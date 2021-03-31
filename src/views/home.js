import { html } from '../lib.js';
import { getQuizesCount, getQuizes } from '../api/data.js';
import { cubeLoader } from './common/loader.js';

const template = (mostRecentQuiz, quizesCount, topicsCount) => html`
<section id="welcome">

    <div class="hero layout">
        <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
        <div class="glass welcome">
            <h1>Welcome to Quiz Fever!</h1>
            <p>Home to ${quizesCount} quizes in ${topicsCount} topics. <a href="/browse">Browse all quizes</a>.</p>
            <a class="action cta" href="/signUp">Sign up to create a quiz</a>
        </div>
    </div>

    <div class="pad-large alt-page">
        <h2>Our most recent quiz:</h2>

        ${[...mostRecentQuiz].map(quizTemplate)}

        <div>
            <a class="action cta" href="/browse">Browse all quizes</a>
        </div>
    </div>

</section>`

const quizTemplate = (quiz) => html`
<article class="preview layout">
    <div class="right-col">
        <a class="action cta" href="/details/${quiz.objectId}">View Quiz</a>
    </div>
    <div class="left-col">
        <h3><a class="quiz-title-link" href=${`/details/${quiz.objectId}`}>${quiz.title} </a> </h3> <span
                class="quiz-topic">Topic: ${quiz.topic}</span>
                <div class="quiz-meta">
                    ${quiz.questionCount > 0 ? html`<span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' :
                        's'}</span>` : ''}
                    <!-- <span>|</span>
            <span>Taken 54 times</span> -->
                </div>
    </div>
</article>`


export async function homePage(ctx) {
    ctx.render(cubeLoader());
    const quizesCount = await getQuizesCount();
    const quizes = (await getQuizes()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    let topicsCount = {};
    Object.entries(quizes).forEach(q => {
        let topic = q[1].topic
        topicsCount[topic] = topic
    });
    topicsCount = Object.values(topicsCount).length

    ctx.render(template(quizes.splice(0, 1), quizesCount, topicsCount))
}