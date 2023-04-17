import { useRealmApp } from "../RealmApp";
import React, { useState } from "react";


function AnswerStatus(props) {
    return props.status === "ANSWER_INCORRECT" ? "Wrong answer" : null;
}

function Response(props) {
    const app = useRealmApp();
    const [ value, setValue ] = useState("Your answer");
    const [ answerStatus, setAnswerStatus ] = useState("UNANSWERED");
    const [ closing, setClosing ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    function submit(event) {
        event.preventDefault();

        setLoading(true);
        app.currentUser.functions.submitAnswer(value).then(result => {
            if (result.ok === true) {
                setAnswerStatus("ANSWER_CORRECT");
                setClosing(result.text);
                setValue("Your answer");
                props.update();
            } else {
                setAnswerStatus("ANSWER_INCORRECT");
                setClosing(null);
                setLoading(false);
            }
        });
    }

    function advance() {
        app.currentUser.functions.advanceStep().then(() => {
            setValue("Your answer");
            setAnswerStatus("UNANSWERED");
            setClosing(null);
            setLoading(false);
            props.reload();
        });
    }

    if (closing) {
        return <div><div>{closing}</div><button className="btn btn-primary" onClick={advance}>Next chapter…</button></div>;
    } else {
        return (
            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="inputResponse" className="form-label">Your answer</label>
                    <input id="inputResponse" className="form-control" type="text" value={value} onChange={event => setValue(event.target.value)}/>
                </div>
                <button className="btn btn-primary" onClick={submit}>{loading ? "Loading…" : "Try it!"}</button> 
                <div><AnswerStatus status={answerStatus}/></div>
            </form>
        );
    }

}

export default Response;