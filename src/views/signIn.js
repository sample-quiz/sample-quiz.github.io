import { html } from '../lib.js'
import { register, login } from '../api/data.js'

const templateLogin = (onSubmit, errorMsg) => html`
<section id="login">
    <div class="pad-large">
        <div class="glass narrow">
            <header class="tab layout">
                <h1 class="tab-item active">Login</h1>
                <a class="tab-item" href="/signUp">Register</a>
            </header>
            <form @submit=${onSubmit} class="pad-med centered">
                <label class="block centered">Username: <input class="auth-input input" type="text"
                        name="username" /></label>
                <label class="block centered">Password: <input class="auth-input input" type="password"
                        name="password" /></label>
                ${errorMsg ? html`<div class="errorMsg">
                    <p>${errorMsg}</p>
                </div>` : ''}

                <input class="block action cta" type="submit" value="Sign In" />
            </form>
            <footer class="tab-footer">
                Don't have an account? <a class="invert" href="/signUp">Create one here</a>.
            </footer>
        </div>
    </div>
</section>`


export async function signIn(ctx) {
    ctx.render(templateLogin(onSubmit))

    async function onSubmit(ev) {
        ev.preventDefault();
        
        const formData = new FormData(ev.target);
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();

        try {
            if(username == '' || password == '' ) {
                throw new Error('All fields are required!')
            }
            
            await login(username, password);
            ctx.setUserNav();
            ctx.page.redirect('/browse')
        } catch (err) {
            if (err == 'Error') {
                err = 'Passwords don\'t match!';
            }
            ctx.render(templateLogin(onSubmit, err))
        }
    }
}


const templateRegister = (onSubmit, errorMsg) => html`
<section id="register">
    <div class="pad-large">
        <div class="glass narrow">
            <header class="tab layout">
                <a class="tab-item" href="/signIn">Login</a>
                <h1 class="tab-item active">Register</h1>
            </header>
            <form @submit=${onSubmit} class="pad-med centered">
                <label class="block centered">Username: <input class="auth-input input" type="text"
                        name="username" /></label>
                <label class="block centered">Email: <input class="auth-input input" type="text" name="email" /></label>
                <label class="block centered">Password: <input class="auth-input input" type="password"
                        name="password" /></label>
                <label class="block centered">Repeat: <input class="auth-input input" type="password"
                        name="repass" /></label>
                ${errorMsg ? html`<div class="errorMsg">
                    <p>${errorMsg}</p>
                </div>` : ''}
                <input class="block action cta" type="submit" value="Create Account" />
            </form>
            <footer class="tab-footer">
                Already have an account? <a class="invert" href="/signIn">Sign in here</a>.
            </footer>
        </div>
    </div>
</section>`

export async function signUp(ctx) {
    ctx.render(templateRegister(onSubmit))

    async function onSubmit(ev) {
        ev.preventDefault();

        const formData = new FormData(ev.target);
        const username = formData.get('username').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const repass = formData.get('repass').trim();

        try {

            if (username == '' || email == '' || password == '') {
                throw new Error('All fields are required!');
            }
            if (password != repass) {
                throw new Error('Passwords don\' match!')
            }

            await register(email, username, password);
            ctx.setUserNav();
            ctx.page.redirect('/browse')
        } catch (err) {
            
            ctx.render(templateRegister(onSubmit, err))
        }

    }
}