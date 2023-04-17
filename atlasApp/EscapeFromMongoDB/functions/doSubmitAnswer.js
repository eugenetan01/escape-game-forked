exports = async function(userId, answer){
  
  const progColl = context.services.get("mongodb-atlas").db("game").collection("progression");
  const stepColl = context.services.get("mongodb-atlas").db("game").collection("stepdefinition");
  
  const prog = (await progColl.findOne({ _id: userId}));
  
  const step = await stepColl.findOne({ _id: prog.current });
  
  async function  validate() {
    if (step.validator == "valueCheck") {
      return (answer == step.solution);
    } else if (step.validator == "urlCheck") {
      return await context.functions.execute(step.solution, answer);
    } else {
      return false;
    }
  }
  
  if (await validate()) {
    
    if (prog.next == null) {
      const update = { "$set": { next: step.next, usedHint: false}, "$currentDate": {"lastSuccess": {"$type": "date"}} };

      if (prog.usedHint) {
        update["$inc"] = { score: step.pointsWithHint };
      } else {
        update["$inc"] = { score: step.points };
      }
    
     progColl.updateOne({_id: userId}, update);
    }
    
    return {ok: true, text: step.closing };
  } else {
    return {ok: false };
  }

};