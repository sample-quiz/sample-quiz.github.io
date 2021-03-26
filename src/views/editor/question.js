import { html, render } from '../../lib.js';
import { createAnswerList } from './answer.js';
import { createQuestion as apiCreate, updateQuestion } from '../../api/data.js';
import { createOverlay } from '../common/loader.js';

const editorTemplate = (data, index, onSave, onCancel) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onSave} class="input submit action"><i class="fas fa-check-double"></i>
            Save</button>
        <button @click=${onCancel} class="input submit action"><i class="fas fa-times"></i> Cancel</button>
    </div>
    <h3>Question ${index + 1}</h3>
</div>
<form>
    <textarea class="input editor-input editor-text" name="text" placeholder="Enter question"
        .value=${data.text}></textarea>

    ${createAnswerList(data, index)}

</form>`




const viewTemplate = (data, index, onEdit, onDelete) => html`
<div class="layout">
    <div class="question-control">
        <button @click=${onEdit} class="input submit action"><i class="fas fa-edit"></i> Edit</button>
        <button @click=${() => onDelete(index)} class="input submit action"><i class="fas fa-trash-alt"></i>
            Delete</button>
    </div>
    <h3>Question ${index + 1}</h3>
</div>
<div>
    <p class="editor-input">${data.text}</p>

    ${data.answers.map((a, i) => radioView(data.correctIndex == i, a))}
</div>`

const radioView = (checked, value) => html`
<div class="editor-input">
    <label class="radio">
        <input class="input" type="radio" ?checked=${checked} disabled />
        <i class="fas fa-check-circle"></i>
    </label>
    <span>${value}</span>
</div>`





export function createQuestion(quizId, question, removeQuestion, updateCount, edit ) {
    let currentQuestion = copyQuestion(question);
    let index = 0;
    let editorActive = edit || false;
    const element = document.createElement('article');
    element.className = 'editor-question';

    showView();

    return update;

    function update(newIndex) {
        index = newIndex;
        if (editorActive) {
            showEditor();
        } else {
            showView();
        }
        return element;
    }

    function onEdit() {
        editorActive = true;
        showEditor();
    }
    /*
       async function onDelete() {
           const confirmed = confirm('Are you sure you want to delete this question?');
           if(confirmed) {
               element.remove();
           }
       }
   */
    async function onSave() {
        
        const formData = new FormData(element.querySelector('form'));

        const data = Array.from(formData.entries());

        const answers = data
            .filter(([k, v]) => k.includes('answer-'))
            .reduce((a, [k, v]) => {
                const index = Number(k.split('-')[1]);
                a[index] = v;
                return a;
            }, []);
        const body = {
            text: formData.get('text'),
            answers,
            correctIndex: Number(data.find(([k, v]) => k.includes('question-'))[1]),
        }
        const loader = createOverlay();
        try {
            element.appendChild(loader);

            if (question.objectId) {
                //update
                await updateQuestion(question.objectId, body);

            } else {
                //create
                const result = await apiCreate(quizId, body);
                updateCount();
                question.objectId = result.objectId;
            }
            Object.assign(question, body);
            currentQuestion = copyQuestion(question);
            editorActive = false;
            update(index);
        } catch (err) {
            console.error(err)
        } finally {
            loader.remove()
        }
    }

    function onCancel() {
        editorActive = false;
        currentQuestion = copyQuestion(question);
        showView();
    }

    function showView() {
        const onDelete = async (index) => {
            const loader = createOverlay();
            element.appendChild(loader);
            await removeQuestion(index, question.objectId);
        }
        render(viewTemplate(currentQuestion, index, onEdit, onDelete), element);
    }
    function showEditor() {
        render(editorTemplate(currentQuestion, index, onSave, onCancel), element);

    }

    function copyQuestion(questions) {
        const currentQuestion = Object.assign({}, questions);
        currentQuestion.answers = currentQuestion.answers.slice();

        return currentQuestion;
    }

}