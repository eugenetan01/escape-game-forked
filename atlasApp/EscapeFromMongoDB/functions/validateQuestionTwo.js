

exports = async function(answer){
  try {
    const res = await context.http.get({ url: answer });
    return res.statusCode == 200;
  } catch (err) {
    return false;
  }
  
  
};