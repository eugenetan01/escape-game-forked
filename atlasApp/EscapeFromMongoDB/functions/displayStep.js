exports = async function(arg){
  
  const step = await context.functions.execute("getStepForPlayer", context.user.id);
  
  
  return {
    intro: step.intro,
    instructions: step.instructions,
    terminal: step.terminal,
    assets: step.assets
  };
};