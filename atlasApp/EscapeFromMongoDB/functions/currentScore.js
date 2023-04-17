exports = async function(){
  return (await context.services.get("mongodb-atlas").db("game").collection("progression").findOne({_id:context.user.id})).score;
};