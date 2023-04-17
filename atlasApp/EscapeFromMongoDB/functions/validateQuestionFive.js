

exports = async function(answer){
  
  async function check(element, expected) {
      try {
        const res = await context.http.get({ url: (answer + "?element=" + element) });
        
        const body = EJSON.parse(res.body.text());
        
        return body.totalShipped == expected;
        
      } catch (err) {
        return false;
      }
  }
  

  const plutonium = await check("plutonium", 329791);
  const uranium = await check("Uranium", 321096);
  const thalium = await check("thalium", 315617);
  
  return plutonium && uranium && thalium;
  
};