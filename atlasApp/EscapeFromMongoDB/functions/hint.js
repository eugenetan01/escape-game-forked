exports = async function(){
  const hint = await context.functions.execute("doHint", context.user.id);
  return hint;
};