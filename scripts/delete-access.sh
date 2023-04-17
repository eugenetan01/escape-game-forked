#WRITE YOUR KEYS HERE
PUBKEY= # TO FILL IN
PRIVKEY= # TO FILL IN
ORG= # TO FILL IN

IDS=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups | jq -r ".results[].id")

#For each group, retrieve the name of the user, their ip address and the database name
#Then delete the access for the ip and the user
for id in $IDS; do
  USERNAME=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$id/databaseUsers | jq -r ".results[].username")
  DBNAME=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$id/databaseUsers | jq -r ".results[].roles[].databaseName")
  IP=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$id/accessList | jq -r ".results[].cidrBlock" | sed -r 's/[/]+/%2F/g')

  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE "https://cloud.mongodb.com/api/atlas/v1.0/groups/$id/databaseUsers/$DBNAME/$USERNAME"
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Accept: application/json" -H "Content-Type: application/json" "https://cloud.mongodb.com/api/atlas/v1.0/groups/$id/accessList/$IP"

done

