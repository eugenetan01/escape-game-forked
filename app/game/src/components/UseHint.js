
function UseHint(props) {
    return props.hint ? props.hint : <button className="btn btn-primary" onClick={props.getHint}>Get a hint</button>;
}

export default UseHint;