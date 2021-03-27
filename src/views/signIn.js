import { html } from '../lib.js'
import { register, login } from '../api/data.js'

const templateLogin = (onSubmit) => html`
<section id="login">
    <div class="pad-large">
        <div class="glass narrow">
            <header class="tab layout">
                <h1 class="tab-item active">Login</h1>
                <a class="tab-item" href="/signUp">Register</a>
            </header>
            <form @submit=${onSubmit} class="pad-med centered">
                <label class="block centered">Username: <input class="auth-input input" type="text" name="username" /></label>
                <label class="block centered">Password: <input class="auth-input input" type="password"
                        name="password" /></label>
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
        const username = formData.get('username');
        const password = formData.get('password');

        await login(username, password);

        ctx.setUserNav();
        ctx.page.redirect('/browse')
    }
}


const templateRegister = (onSubmit) => html`
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
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const repass = formData.get('repass');

        if(username == '' || email == '' || password == '') {
            return alert('All fields are required!');
        }
        if(password != repass) {
            return alert('Passwords don\' match!')
        }

        await register(email, username, password);

        ctx.setUserNav();
        ctx.page.redirect('/browse')
    }
}