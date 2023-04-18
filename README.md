# ESCAPE FROM MONGODB

## Deploy instructions

Create a cluster (M0 is sufficient) and call it EscapeFromMongoDB (**important!**) and import the game data:

`mongosh "uri" --apiVersion 1 --username username gamedata.js`

To see game answers and explanation for each question, see [this](https://docs.google.com/presentation/d/1ofHYkkDV9bpy4vdVkdM3XtGh0YTv7tqmvJtDXTLIJWs/edit#slide=id.g21708ab8ba4_0_308) google slides presentation:

create the Atlas application:

```
cd atlasApp/EscapeFromMongoDB
realm-cli login
realm-cli push --remote EscapeFromMongoDB
```

Answer the questions from realm-cli:

- create a new app: yes
- app name: as you wish, default EscapeFromMongoDB is ok
- app location: as you wish depending on your location
- app deployment model: LOCAL
- app environment: production

It then asks to commit the changes, answer yes.

Finally it says something like: `Successfully pushed app up: escapefrommongodb-kbxge`. This is your app id, take a note of it.

Move to ../../app/game and edit src/App.js to setup your app id on line 10:

`export const APP_ID = "escapefrommongodb-kbxge";`

Install npm dependencies and build the app:

```
npm install
npm run build
```

Copy the contents of the `build` directory to atlasApp/hosting/files

```
cp -R build ../../atlasApp/EscapeFromMongoDB/hosting/files --> this command moves the build dir. Instead copy out the contents of build folder to atlasApp/hosting/files dir
```

Then you can push the hosting files:

```
cd ../../atlasApp/EscapeFromMongoDB
realm-cli push -s
```

In Atlas, you can navigate to your EscapeFromMongoDB app and enable static hosting when you are ready to start the frontend. This takes a few minutes.

Then, launch `gamedata.js` to add the questions and hint.

## Players and clusters

You can add players by going to Authentication/Users and clicking "Add New User". It is not actually necessary for the "email" field to be an email, it can be any user name.

For simplicity's sake, in the scripts directory there is a create-users.sh script to create users and passwords. Create a teams.txt file with a login per line (there's a sample with names taken from old James Bond movies, but you can use whatever takes your fancy). The script generates a password using `pwgen` for each and creates the user on the Atlas backend.

First add your app id, group id and access token as explained on this page: https://www.mongodb.com/docs/atlas/app-services/admin/api/v3/#section/Project-and-Application-IDs

The doc is a bit confusing, first you get your regular Atlas project ID, then using your Atlas API key you get a bearer token by calling the login endpoint like this:

```
curl --request POST \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{"username": "<Public API Key>", "apiKey": "<Private API Key>"}' \
  https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login`
```

and then you can get the app id by calling the apps endpoint:

```
curl --request GET \
  --header 'Authorization: Bearer <access_token>' \
  https://realm.mongodb.com/api/admin/v3.0/groups/{groupId}/apps
```

Install pwgen. This will be required to automatically generate password for the users. If you are using a mac, it can be done with `Homebrew`

```
brew install pwgen
```

Edit `create-users.sh` to add your appid, groupid and access token, then you can call it to generate users.

For each player, create a project and a cluster (I call them "SecretData" but there's no rule).

In the `scripts` directory there is a `create-projects.sh` script that lets you create a project per team. I recommend creating an organization for each run of the game, then edit the script with orgid, private and public key. It takes the same teams.txt as create-users.sh.

Run the `create-clusters.sh` script to create the players' clusters and restore the game data set.

For the Data Federation question to work:

- create an S3 bucket
- create an IAM profile that can read this bucket:
- create the trust relationship with the players' Atlas projects

For this: in the first Atlas project, select Project Settings > Integrations > AWS
Click "Authorize AWS IAM Role"
Follow the instructions to create the role with the CLI
Paste the new role ARN in the Atlas page.

For all other projects, select "Add Trust Relationship to an existing role" and copy the provided Statement to the Role's policy (in AWS). When the policy is updated in AWS, you can Validate and Finish.

Note - you may have to create two or more roles, as a single policy document is limited to 20KB.

Then in AWS, go to the Permission tab of your role and add an inline permission policy with the following content:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::yourbucketname",
        "arn:aws:s3:::yourbucketname/*"
      ]
    }
  ]
}
```

(customize _yourbucketname_)

- Prepare the data - don't create the data federation, it would be too easy!

In the bucket import the prices that are in data/prices.tar.gz (without the `prices` prefix), using the following command: `aws --profile yourprofile s3 sync prices s3://yourbucketname`. (Customise _yourprofile_ and _yourbucketname_)

When you are good to go, you can fill the email.json with the email list. Be careful to follow the schema in order for the script to read everything correctly.
Then you can run `invite-create.sh`.

When the escape game has ended and you want to delete the clusters, you can run the script `delete-clusters.sh`. Don't forget to clean up the S3 / IAM side too.

## Leaderboard

It's very easy to design a leaderboard with Charts! It doesn't have an API (yet), so it can't be automated; but basically:

- connect Charts to the admin cluster
- the `game.progression` collection contains a `name` and a `score` properties, that you can easily build a bar chart off of. In the first run of the game we had a laptop plugged into a big screen showing the leaderboard on 1-min autorefresh, that did the trick nicely.
