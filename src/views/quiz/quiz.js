import { html, until } from '../../lib.js';
import { getQuizById, getQuestionByQuizId } from '../../api/data.js';
import { cubeLoader } from '../common/loader.js';

const quizTemplate = (quiz, questions, currentIndex) => html`
<section id="quiz">
    <header class="pad-large">
        <h1>${quiz.title}: Question ${currentIndex + 1} / ${questions.length}</h1>
        <nav class="layout q-control">
            <span class="block">Question index</span>
            ${questions.map((q, i) => html`<a class="q-index q-current q-answered"
                href="/quiz/${quiz.objectId}?question=${i + 1}"></a>`)}

        </nav>
    </header>
    <div class="pad-large alt-page">

        <article class="question">
            <p class="q-text">
                ${questions[currentIndex].text}
            </p>

            <form>
            ${questions.map((q, i) => questionTemplate(q, i, i == currentIndex))}
            </form> 

            <nav class="q-control">
                <span class="block">12 questions remaining</span>
                <a class="action" href=#><i class="fas fa-arrow-left"></i> Previous</a>
                <a class="action" href=#><i class="fas fa-sync-alt"></i> Start over</a>
                <div class="right-col">
                    <a class="action" href=#>Next <i class="fas fa-arrow-right"></i></a>
                    <a class="action" href=#>Submit answers</a>
                </div>
            </nav>
        </article>

    </div>
</section>`


const questionTemplate = (question, index, isCurrent) => html`
<div data-index="question-${index}" style=${isCurrent ? '' : 'display:none'}>
    ${question.answers.map((a, i) => answerTemplate(index, i, a))}
</div>`

const answerTemplate = (questionIndex, index, text) => html`
<label class="q-answer radio">
    <input class="input" type="radio" name="question-${questionIndex}" value=${index} />
    <i class="fas fa-check-circle"></i>
    ${text}
</label>`


export async function quizPage(ctx) {
    const quizId = ctx.params.id;

    ctx.render(until(getQuiz(quizId), cubeLoader()));
}

async function getQuiz(quizId) {
    const quiz = await getQuizById(quizId);
    const ownerId = quiz.owner.objectId;
    const questions = await getQuestionByQuizId(quizId, ownerId);

    return quizTemplate(quiz, questions, 0);
}