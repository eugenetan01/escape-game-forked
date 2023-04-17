import { useRealmApp } from "../RealmApp";
import * as Realm from "realm-web";
import React from "react";



function LoginScreen() {
    const [login, setLogin] = React.useState("login");
    const [pass, setPass] = React.useState("****");
    const [error, setError] = React.useState(false);

    const app = useRealmApp();

    async function handleSubmit(event) {

        event.preventDefault();

        try {

            await app.logIn(Realm.Credentials.emailPassword(login, pass), login);
            setError(false);
        } catch (err) {
            console.error("Cannot login", err);
            setError(true);
        }

    }

    const errElt = error ? <span className="error">Invalid login or password</span> : null;

    return (
        <div>
            <h3>Please log in</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="inputLogin" className="form-label">Login</label>
                    <input id="inputLogin" className="form-control" type="text" value={login} onChange={(event) => setLogin(event.target.value)}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPass" className="form-label">Password</label>
                    <input id="inputPass" className="form-control" type="password" value={pass} onChange={(event) => setPass(event.target.value)}/>
                </div>
                {errElt}
                
                <input className="btn btn-primary" type="submit" value="Login"/>
            </form>
        </div>
    );
}


export default LoginScreen;