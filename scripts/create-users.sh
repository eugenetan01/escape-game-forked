APPID="app_id"
GROUPID="proj_id"
ACCESS="token"

while read -r name ; do
  PWD="escapegame"
  echo "$name : $PWD\n"
  #https://realm.mongodb.com/api/admin/v3.0/groups/{groupId}/apps/{appId}/users
  curl -s -X POST -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -H "Accept: application/json" \
  -d "{\"email\": \"$name\",\"password\":\"$PWD\"}" https://realm.mongodb.com/api/admin/v3.0/groups/$GROUPID/apps/$APPID/users
done < teams.txt > passwords.txt
