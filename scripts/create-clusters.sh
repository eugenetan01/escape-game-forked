source credentials.sh

tar xfz ../data/dump.tar.gz

while read -r name; do
  echo $name
  GROUPID=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/byName/$name | jq -r ".id")
  stateName=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X POST -H "Content-Type: application/json" \
    -d '{"name":"SecretData","providerSettings":{"providerName":"TENANT","instanceSizeName":"M0","backingProviderName":"AWS","regionName":"AP-SOUTHEAST-1"}}' \
    https://cloud.mongodb.com/api/atlas/v1.0/groups/{$GROUPID}/clusters | jq -r ".stateName")

  echo $stateName
  
  while [ "$stateName" == "CREATING" ]
  do
    sleep 1
    stateName=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$GROUPID/clusters/SecretData | jq -r ".stateName")
    echo $stateName
  done

  echo "Cluster created; creating temp user"
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X POST -H "Content-Type: application/json" -d "{\"databaseName\":\"admin\",\"groupId\":\"$GROUPID\", \"roles\": [{\"databaseName\":\"admin\", \"roleName\":\"atlasAdmin\"}],\"username\":\"temp\",\"password\":\"temp\"}"  https://cloud.mongodb.com/api/atlas/v1.0/groups/$GROUPID/databaseUsers > /dev/null
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X POST -H "Content-Type: application/json" -d '[{"ipAddress": "0.0.0.0"}]' https://cloud.mongodb.com/api/atlas/v1.0/groups/{$GROUPID}/accessList > /dev/null

  connString=$(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$GROUPID/clusters/SecretData | jq -r ".connectionStrings.standardSrv")

  echo $connString
  echo "Conn string is $connString; waiting 10s before attempting restore"
  sleep 10

  mongorestore --username temp --password temp $connString dump

  echo "Restored dump. Deleting temp user and access list"
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/{$GROUPID}/accessList/0.0.0.0%2F0 > /dev/null
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$GROUPID/databaseUsers/admin/temp > /dev/null

done < teams.txt

rm -rf dump
