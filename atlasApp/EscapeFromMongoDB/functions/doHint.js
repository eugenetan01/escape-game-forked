exports = async function(userId){

  const progColl = context.services.get("mongodb-atlas").db("game").collection("progression");
  const stepColl = context.services.get("mongodb-atlas").db("game").collection("stepdefinition");
  
  const prog = await progColl.findOne({_id: userId});
  
  
  const step = await stepColl.findOne({ _id: prog.current});
  
  if (prog.next) {
    return step.hint;
  } else {
    progColl.updateOne({ _id: userId}, {$set: {usedHint:true}});
    return step.hint;
  }
};