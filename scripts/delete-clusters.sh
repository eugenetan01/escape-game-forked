source credentials.sh

echo "Org: $ORG"

for project in $(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/orgs/$ORG/groups | jq -r ".results[].id"); do
  for cluster in $(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$project/clusters | jq -r ".results[].name"); do
    echo "Deleting cluster $cluster in project $project"
    curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$project/clusters/$cluster
  done
  for df in $(curl --digest --user "$PUBKEY:$PRIVKEY" -s -X GET -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$project/dataFederation | jq -r ".[].name"); do
    echo "Deleting data federation $df in project $project"
    curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$project/dataFederation/$df
  done

  echo "Deleting project $project"
  curl --digest --user "$PUBKEY:$PRIVKEY" -s -X DELETE -H "Content-Type: application/json" https://cloud.mongodb.com/api/atlas/v1.0/groups/$project
done
