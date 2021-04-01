import { html, until } from '../lib.js';
import { getQuizes } from '../api/data.js'
import { cubeLoader } from '../views/common/loader.js'


const template = (topics, onSubmit, searchFields) => html`
<section id="browse">
    <header class="pad-large">
        <form @submit=${onSubmit} class="browse-filter">
            <input class="input" placeholder="Title" type="text" name="title">
            <select class="input" name="topic">
                <option value="all">All Categories</option>

                ${topics ? topics.map(topicTemplate) : ''}

            </select>
            <input class="input submit action" type="submit" value="Filter Quizes">
        </form>
        <h1>All quizes</h1>
    </header>

    ${until(loadQuizes(searchFields), cubeLoader())}



</section>`

const topicTemplate = (topic) => html`<option value=${topic}>${topic}</option>`


async function loadQuizes(searchFields) {
    let quizes = (await getQuizes()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    if(searchFields != undefined) {
        if (searchFields.title != '' && searchFields.topic != 'all') {
            quizes = quizes.filter(quiz => quiz.title.toLowerCase().includes(searchFields.title.toLowerCase()) && quiz.topic == searchFields.topic);
        } else if (searchFields.title != '' && searchFields.topic == 'all') {
            quizes = quizes.filter(quiz => quiz.title.toLowerCase().includes(searchFields.title.toLowerCase()));
        } else if (searchFields.title == '' && searchFields.topic != 'all') {
            quizes = quizes.filter(quiz => quiz.topic == searchFields.topic);
        }
    }

    return html`
    <div class="pad-large alt-page">
    
        ${quizes.map(quizTemplate)}
    
    </div>`
}

const quizTemplate = (quiz) => html`
<article class="preview layout">
    <div class="right-col">
        <a class="action cta" href=${`/details/${quiz.objectId}`}>View Quiz</a> </div> <div class="left-col">
            <h3><a class="quiz-title-link" href=${`/details/${quiz.objectId}`}>${quiz.title} </a> </h3> <span
                    class="quiz-topic">Topic: ${quiz.topic}</span>
                    <div class="quiz-meta">
                        ${quiz.questionCount > 0 ? html`<span>${quiz.questionCount} question${quiz.questionCount == 1 ?
                            '' : 's'}</span>` : ''}
                        <!-- <span>|</span>
            <span>Taken 54 times</span> -->
                    </div>
    </div>
</article>`

export async function browsePage(ctx) {
    let searchFields = undefined;
    const topics = {};
    const params = ctx.querystring.split('&');
    if(params[0] != '') {
        const title = params[0].split('=')[1];
        const topic = params[1].split('=')[1];

        searchFields = {
            title,
            topic
        }
    }

    Object.entries(await getQuizes()).forEach(q => {
        let topic = q[1].topic
        topics[topic] = topic
    });

    ctx.render(template(Object.values(topics), onSubmit, searchFields));


    function onSubmit(ev) {
        ev.preventDefault();
        
        const formData = new FormData(ev.target);

        const titleForm = formData.get('title');
        const topicForm = formData.get('topic');
        ctx.page.redirect(`/browse?title=${titleForm}&topic=${topicForm}`);
        ev.target.reset();

    }
}
