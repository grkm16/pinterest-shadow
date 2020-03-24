const express = require('express')
const app = express()
const path = require('path');
const request = require('request');


require('dotenv').config();

app.use('/public', express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
        res.type('.html').sendFile(page("index"))
})
app.get('/api/user/',(req,res)=>{
    res.redirect(process.env.WEBPATH);
})
app.get('/api/user/:user',(req,res,next)=>{

    const {user} = req.params;
    try{
    request(search(user.trim()), function (error, response, body) {
      //  console.error('error:', error); // Print the error if one occurred
      let has = false;
      if(response && response.statusCode == 200){
            const r = JSON.parse(body);
            if(r && r.resource_response){
                if(r.resource_response.status == "success"){
                    if(r.resource_response.data && r.resource_response.data.results 
                        && r.resource_response.data.results.length > 0){
                            let item = r.resource_response.data.results.find(item => item.username.toLowerCase() == user.trim().toLowerCase());
                            if(item){
                                has = true;
                            }                           
                        }
                        
                }
            }
      } 

      jsonresponse(res,next,has);
      res.end();  
    });
}catch{
    res.json({
        status:"error",
        result:"Request undefined"
    }).end();
}
      

})

function jsonresponse(res,next,status){
    let json;
    if(status){
        json = {
            status:"success",
            result:"NO SHADOW"
        }
    }else{
        json = {
            status:"error",
            result:"SHADOW"
        }
    }
    res.json(json);
    next();
}

function search(query){
    return `https://tr.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fpassword%2Freset%2F%3Fq%3D&data=%7B%22options%22%3A%7B%22scope%22%3A%22obfuscated_users%22%2C%22query%22%3A%22${query}%22%2C%22page_size%22%3A25%7D%2C%22context%22%3A%7B%7D%7D&_=1585055135317`;
}

function page(name){
    return __dirname+"/pages/"+name+".html";
}





app.listen(PORT,() => console.log(`aktif : ${PORT}`))