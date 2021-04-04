import { html } from '../../lib.js'

const resultTemplate = (quiz, answers, result, seeDetails) => html`
<section id="summary">
    <div class="hero layout">
        <article class="details glass">
            <h1>Quiz Results</h1>
            <h2>${quiz.title}</h2>

            <div class="summary summary-top">
                ${result.percent} %
            </div>

            <div class="summary">
                ${result.correct}/${result.total} correct answers
            </div>

            <a class="action cta" href="/quiz/${quiz.objectId}"><i class="fas fa-sync-alt"></i> Retake Quiz</a>
            <a @click=${seeDetails} class="action cta" href="javascript:void(0)"><i class="fas fa-clipboard-list"></i>
                See Details</a>

        </article>
    </div>

    <div class="pad-large alt-page details">


        ${quiz.questions.map((q, i) => questionTemplate(q, i, answers))}


    </div>

</section>`

const questionTemplate = (question, i, answers) => html`
<article class="preview">
    <span class=${question.correctIndex == answers[i] ? "s-correct" : "s-incorrect"}>
        Question ${i}
        ${question.correctIndex == answers[i] ? html`<i class="fas fa-check"></i>` : html`<i class="fas fa-times"></i>`}

    </span>
    <div class="right-col">
        <button @click=${seeQuestion} class="action">See question</button>
    </div>

    <div class="question-details">
        <p>
            ${question.text}
        </p>

        ${question.answers.map((a, answerIndex) => answerTemplate(a, answerIndex, question.correctIndex,
    answers[i]))}


</article>`

function seeQuestion (ev) {
    const target = ev.target.parentNode.parentNode.querySelector('.question-details');
    if(target.style.display == 'none') {
        target.style.display = 'block';
    } else {
        target.style.display = 'none';
    }
}


const answerTemplate = (answer, answerIndex, correctAnswer, yourAnswer) => html`
<div class="s-answer">


    ${correctAnswer == yourAnswer && correctAnswer == answerIndex ? html`
    <span class="s-correct">
        ${answer}
        ${correctAnswer == yourAnswer && yourAnswer == answerIndex ? html`
        <i class="fas fa-check"></i>
        <strong>Your answer</strong>` : ''}
    </span>` : ""}

    ${correctAnswer != answerIndex && yourAnswer != answerIndex ? html`
    <span>
        ${answer}
    </span>` : ""}

    ${correctAnswer != yourAnswer && correctAnswer == answerIndex ? html`
    <span class="s-correct">

        ${correctAnswer != yourAnswer && correctAnswer == answerIndex ? html`
        <i class="fas fa-check"></i>
        ${answer}
        <strong>Correct answer</strong>` : ''}
    </span>` : ""}

    ${correctAnswer != yourAnswer && yourAnswer == answerIndex ? html`
    <span class="s-incorrect">
        ${answer}
        <i class="fas fa-times"></i>
        <strong>Your answer</strong>
    </span>` : ''}



</div>`

export async function result(ctx) {
    const questions = ctx.quiz.questions;
    const answers = ctx.quiz.answers;
    const correct = answers.reduce((r, c, i) => r + Number(questions[i].correctIndex == c), 0)

    ctx.render(resultTemplate(ctx.quiz, answers, {
        percent: (correct / questions.length * 100).toFixed(0),
        correct,
        total: questions.length
    }, seeDetails));


}

function seeDetails(ev) {
    if (document.querySelector('.pad-large.alt-page.details').style.display == 'none') {
        document.querySelector('.pad-large.alt-page.details').style.display = 'block';
    } else {
        document.querySelector('.pad-large.alt-page.details').style.display = 'none'
    }
}


/*
questions
<article class="preview">
            <span class="s-correct">
                Question 1
                <i class="fas fa-check"></i>
            </span>
            <div class="right-col">
                <button class="action">See question</button>
            </div>
        </article>

        <article class="preview">
            <span class="s-correct">
                Question 2
                <i class="fas fa-check"></i>
            </span>
            <div class="right-col">
                <button class="action">See question</button>
            </div>
        </article>

        <article class="preview">
            <span class="s-incorrect">
                Question 3
                <i class="fas fa-times"></i>
            </span>
            <div class="right-col">
                <button class="action">Reveal answer</button>
            </div>
 </article>

answer
<div class="s-answer">
            <span class="s-correct">
                This is answer 2
                <i class="fas fa-check"></i>
                <strong>Correct answer</strong>
            </span>
        </div>
        <div class="s-answer">
            <span>
                This is answer 3
            </span>
        </div>

*/