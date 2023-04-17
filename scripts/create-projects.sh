source credentials.sh

while read -r name; do
  echo $name
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X POST -H "Content-Type: application/json" -d "{\"name\":\"$name\",\"orgId\":\"$ORG\"}"  \
  https://cloud.mongodb.com/api/atlas/v1.0/groups
done < teams.txt
