source credentials.sh

ACCESS=$(curl -s --request POST \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data "{\"username\": \"$GROUPPUBKEY\", \"apiKey\": \"$GROUPPRIVKEY\"}" \
  https://realm.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login | jq -r ".access_token")

INTERNAL_APP_ID=$(curl -s --request GET --header "Authorization: Bearer $ACCESS" https://realm.mongodb.com/api/admin/v3.0/groups/$GROUPID/apps | jq -r ".[] | select(.client_app_id==\"$APPID\") | ._id")

USERS=$(curl -s -X GET -H "Authorization: Bearer $ACCESS" https://realm.mongodb.com/api/admin/v3.0/groups/$GROUPID/apps/$INTERNAL_APP_ID/users)

while read -r name; do
  echo "Trying to delete user $name"
  userid=$(echo $USERS | jq -r ".[] | select(.data.email==\"$name\") | ._id")
  echo "Found userid: $userid"
  curl -s -X DELETE --header "Authorization: Bearer $ACCESS" https://realm.mongodb.com/api/admin/v3.0/groups/$GROUPID/apps/$INTERNAL_APP_ID/users/$userid
done < teams.txt

#while read -r name ; do
#  echo "$name : $PWD\n"
#  #https://realm.mongodb.com/api/admin/v3.0/groups/{groupId}/apps/{appId}/users
#  curl -s -X POST -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -H "Accept: application/json" \
#  -d "{\"email\": \"$name\",\"password\":\"$PWD\"}" https://realm.mongodb.com/api/admin/v3.0/groups/$GROUPID/apps/$APPID/users
#done < teams.txt 
