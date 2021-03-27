import { html, render } from '../../lib.js';
import { createList } from './list.js';
import { createQuiz, updateQuiz, getQuizById, getQuestionByQuizId } from '../../api/data.js';

const template = (quiz, quizEditor, updateCount) => html`
<section id="editor">

    <header class="pad-large">
        <h1>${quiz ? 'Edit quiz' : 'New quiz'}</h1>
    </header>

    ${quizEditor}
    <div class="">
   
    </div>

    ${quiz ? createList(quiz.objectId, quiz.questions, updateCount) : ''}

</section>`

const quizEditorTemplate = (quiz, onSave, working) => html`
     <form @submit=${onSave}>
            <label class="editor-label layout">
                <span class="label-col">Title:</span>
                <input class="input i-med" type="text" name="title" .value=${quiz ? quiz.title : '' } ?disabled=${working}></label>
            <label class="editor-label layout">
                <span class="label-col">Topic:</span>
                <input class="input i-med" name="topic" .value=${quiz ? quiz.topic : '' } ?disabled=${working}>
            </label>
            <label class="editor-label layout">
                <span class="label-col">Description:</span>
                <textarea class="input i-med" name="description" .value=${quiz && quiz.description ? quiz.description
                    : '' } ?disabled=${working}> </textarea>
            </label>
            <input class="input submit action" type="submit" value="Save">
        </form>

        ${working ? html`<div class="loading-overlay working"></div>` : ''}`


function createQuizEditor(quiz, onSave) {
    const editor = document.createElement('div');
    editor.className = 'pad-large alt-page';
    update();

    function update (working) {
       render(quizEditorTemplate(quiz, onSave, working), editor);
    }
    return {
        editor,
        updateEditor: update,
    };
}

export async function editorPage(ctx) {
    const quizId = ctx.params.id;
    let quiz = null;
    let questions = [];
    if (quizId) {
        [quiz, questions] = await Promise.all([
            getQuizById(quizId),
            getQuestionByQuizId(quizId, sessionStorage.getItem('userId'))
        ]);
        quiz.questions = questions;
    }
    const {editor, updateEditor} = createQuizEditor(quiz, onSave);

    ctx.render(template(quiz, editor, updateCount));


    async function updateCount(change = 0) {
        const count = questions.length + change;
        await updateQuiz(quizId, {questionCount: count})
    }



    async function onSave(ev) {
        ev.preventDefault();

        const formData = new FormData(ev.target);

        const title = formData.get('title');
        const topic = formData.get('topic');
        const description = formData.get('description');

        if(title != '' && topic != '' && description != '') {

            const data = {
                title,
                topic,
                description,
                questionCount: questions.length
            };
            try {
                updateEditor(true);
                
                
                if (quizId) {
                    await updateQuiz(quizId, data);
                } else {
                    const result = await createQuiz(data);
                    ctx.page.redirect('/edit/' + result.objectId);
                }
            } catch (err) {
                console.error(err);
            } finally {
                updateEditor(false);
            }
        }
    }

    
}