exports = async function(userId){
  
  progressionColl = context.services.get("mongodb-atlas").db("game").collection("progression");
  stepColl = context.services.get("mongodb-atlas").db("game").collection("stepdefinition");
  
  const step = await progressionColl.findOne({_id:userId});
  const stepDef = await stepColl.findOne({_id: step.current});
  
  //console.log("Step: " + current);
  //let stepDef = await stepColl.findOne({_id:step});
  
  //console.log("Found step: " + step + "; def: ", stepDef);

  return stepDef;
};