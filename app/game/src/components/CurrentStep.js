import { useRealmApp } from "../RealmApp";
import React, {useEffect} from "react";
import UseHint from "./UseHint";
import Response from "./Response";

function CurrentStep(props) {
    const app = useRealmApp();

    const [ intro, setIntro ] = React.useState(["-"]);
    const [ instructions, setInstructions ] = React.useState(["-"]);
    const [ assets, setAssets ] = React.useState([]);
    const [ hint, setHint ] = React.useState(null);
    const [ terminal, setTerminal ] = React.useState(false);

    const reload = () => {
        // console.log("Reloading question");
        app.currentUser.functions.displayStep().then(result => {
            setIntro(result.intro);
            setInstructions(result.instructions);
            setAssets(result.assets);
            setHint(null);
            setTerminal(result.terminal);
        });
    };

    const getHint = () => {
        // console.log("Get hint");
        app.currentUser.functions.hint().then(setHint);
    };

    useEffect(reload, []);

    const introText = intro.map((x,i) => <p key={"intro" + i}>{x}</p>);
    const instText = instructions.map((x,i) => <p key={"instr" + i}>{x}</p>);

    const assetsElem = assets != undefined ? <ul>{assets.map((x,i) => <li key={"asset" + i}><a href={x}>{x}</a></li>)}</ul> : null;

    if (terminal) {
        return (
            <div>
                {introText}
            </div>
        );
    } else {
        return (<div>
            {introText}
            {instText}
            {assetsElem}
            <p><span className="usehint"><UseHint hint={hint} getHint={getHint}/></span></p>
            <div><Response reload={reload} update={props.update}/></div>
        </div>);
    }
}

export default CurrentStep;