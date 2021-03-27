import { html, until } from '../lib.js';
import { getQuizes } from '../api/data.js'
import {cubeLoader} from '../views/common/loader.js'


const template = (topics) => html`
<section id="browse">
    <header class="pad-large">
        <form class="browse-filter">
            <input class="input" type="text" name="query">
            <select class="input" name="topic">
                <option value="all">All Categories</option>
        
                ${topics ? topics.map(topicTemplate) : ''}
                
            </select>
            <input class="input submit action" type="submit" value="Filter Quizes">
        </form>
        <h1>All quizes</h1>
    </header>

    ${until(loadQuizes(), cubeLoader())}



</section>`

const topicTemplate = (topic) => html`<option value=${topic}>${topic}</option>`


async function loadQuizes() {
    const quizes = await getQuizes();
    
    return html`
    <div class="pad-large alt-page">
    
    ${quizes.map(quizTemplate)};
    
    </div>`
}

const quizTemplate = (quiz) => html`
<article class="preview layout">
    <div class="right-col">
        <a class="action cta" href=${`/details/${quiz.objectId}`}>View Quiz</a>
    </div>
    <div class="left-col">
        <h3><a class="quiz-title-link" href=${`/details/${quiz.objectId}`}>${quiz.title}</a></h3>
        <span class="quiz-topic">Topic: ${quiz.topic}</span>
        <div class="quiz-meta">
            ${quiz.questionCount > 0 ? html`<span>${quiz.questionCount} question${quiz.questionCount == 1 ? '' : 's'}</span>` : ''}
            <span>|</span>
            <span>Taken ? times</span>
        </div>
    </div>
</article>`

export async function browsePage(ctx) {
    const topics = Object.entries(await getQuizes()).map(q => {
        return q[1].topic;
    });

    ctx.render(template(topics));
}