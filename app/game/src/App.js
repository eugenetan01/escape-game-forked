import React from "react";

import { useRealmApp, RealmAppProvider } from "./RealmApp";
import LoginScreen from "./components/LoginScreen";
import CurrentStep from "./components/CurrentStep";

export const APP_ID = "escapefrommongodb-jmdcb";

const RequireLoggedInUser = ({ children }) => {
  const app = useRealmApp();
  return app.currentUser ? children : <LoginScreen />;
};

const LogOut = () => {
  const app = useRealmApp();
  function doLogout() {
    app.logOut();
  }

  return app.currentUser ? (
    <button className="btn btn-outline-primary" onClick={doLogout}>
      Log out
    </button>
  ) : null;
};

function Game() {
  const app = useRealmApp();
  const [score, setScore] = React.useState(0);

  const updateScore = () => {
    app.currentUser.functions.currentScore().then(setScore);
    //app.currentUser.mongoClient("mongodb-atlas").db("game").collection("progression").findOne({_id: app.currentUser.id}).then(prog => setScore(prog.score));
  };

  React.useEffect(() => {
    updateScore();
    app.refreshUsername();
  }, []);

  return (
    <div>
      <div className="score">
        Player name: {app.username} - Current score: {score} <LogOut />
      </div>
      <CurrentStep update={updateScore} />
    </div>
  );
}

function App() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <Game />
      </RequireLoggedInUser>
    </RealmAppProvider>
  );
}

export default App;
