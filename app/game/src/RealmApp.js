import React from "react";
import * as Realm from "realm-web";

const RealmAppContext = React.createContext();

export const useRealmApp = () => {
  const app = React.useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `You must call useRealmApp() inside of a <RealmAppProvider />`
    );
  }
  return app;
};

export const RealmAppProvider = ({ appId, children }) => {

  const [app, setApp] = React.useState(new Realm.App(appId));

  React.useEffect(() => {
    setApp(new Realm.App(appId));
  }, [appId]);

  // Wrap the Realm.App object's user state with React state
  const [currentUser, setCurrentUser] = React.useState(app.currentUser);
  const [username, setUsername] = React.useState(app.username);

  async function logIn(credentials, _name) {
    await app.logIn(credentials);
    await refreshUsername();
    setCurrentUser(app.currentUser);
    return app.currentUser;
  }
  async function refreshUsername() {
    setUsername(await app.currentUser.functions.getUserEmail());
  }
  async function logOut() {
         // Log out the currently active user
    await app.currentUser?.logOut();
    // If another user was logged in too, they're now the current user.
    // Otherwise, app.currentUser is null.
    setCurrentUser(app.currentUser);
  }

  const wrapped = { ...app, currentUser, username, refreshUsername, logIn, logOut };

  return (
    <RealmAppContext.Provider value={wrapped}>
      {children}
    </RealmAppContext.Provider>
  );
};
