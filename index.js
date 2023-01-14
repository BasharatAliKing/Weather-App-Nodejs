const fs=require("fs");
const http=require("http");
const requests=require("requests");
const homefile=fs.readFileSync("home.html","utf-8");

const replaceVal =(tempval,orgval)=>{
    let temperature=tempval.replace("{%tempval%}",orgval.main.temp);
    temperature= temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature= temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature= temperature.replace("{%location%}",orgval.name);
    temperature= temperature.replace("{%country%}",orgval.sys.country);
    temperature= temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature;
}

const server=http.createServer((req,res)=>{
   if(req.url=="/"){
    requests(
        "http://api.openweathermap.org/data/2.5/weather?q=Pattoki&appid=51a343312a6c18817c50d60dfc704d2d",
    ).on("data", (chunk)=>{
      const objdata=JSON.parse(chunk);
      const arrData=[objdata];
      const realTimeData=arrData.map((val)=>replaceVal(homefile,val))
      .join(" ");
         res.write(realTimeData);
        // console.log(realTimeData);
       //  console.log(arrData[0].main.temp);
       // console.log(chunk);
    })
    .on("end",(err) =>{
        if(err) return console.log("connection closed due to error",err);
         res.end();
        // console.log("end");
    });
   }
});

server.listen(9000,"127.0.0.1");