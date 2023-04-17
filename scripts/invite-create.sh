#WRITE YOUR KEYS HERE
PUBKEY= # TO FILL IN
PRIVKEY= # TO FILL IN
ORG= # TO FILL IN

#email.json schema
# {"id": "groupid", "mailList": [ "mail1@company.com", "mail2@company.com",  "mail3@company.com"] } 
# { "id": "groupid", "mailList": [ "mail4@company.com", "mail5@company.com"] }
#It is important that the id and maillist are on the SAME line in order to be read together.

#For each line (one line = one group + one mail list)
#We retrieve the groupid and the mails
#Then for each mail we send an invite to be a group owner 
while read -r line; do
  ID=$(echo $line | jq -r .id)
  MAIL=$(echo $line | jq -r .mailList[])
  for m in $MAIL; do
    echo "{\"roles\": [ \"GROUP_OWNER\" ],\"username\": \"$m\" }\""
    curl --digest --user "$PUBKEY:$PRIVKEY" -s -X POST -H "Content-Type: application/json" -H "Accept: application/json"  -d  "{\"roles\": [ \"GROUP_OWNER\" ],\"username\": \"$m\" }\"" https://cloud.mongodb.com/api/atlas/v1.0/groups/$ID/invites
  done
  echo "id = $ID"
  echo "mail = $MAIL"
done < email.json