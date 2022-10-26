const express = require('express')
const path = require('path')
var validUrl = require('valid-url')
const app = express()

app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/', async (req,res,next) => {
    res.send('get')
})


const sql = require('msnodesqlv8');
const connectionString="server=DESKTOP-Q5VTMMT;Database=url_shorter;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}"

//const query="insert into urls values()"

//sql.query(connectionString,query,(err,rows) => {
    //console.log(rows)

//})
let varmi='';
app.post("/", async (req,res,next) => {

    if (validUrl.isHttpsUri(req.body.url)){       
        console.log("I am valid url")

        var varmi =  await isExistUrl(await req.body.url);
      
        console.log('burda'+varmi)
        if( varmi == null){
            var shortUrl= await generateRandomUrl();
            var longUrl = req.body.url;
            console.log("sHORT" + shortUrl)
            console.log(longUrl.toString())
            var sorgu = `insert into urls values('${longUrl}' ,'${shortUrl}')`
            console.log(sorgu)
            const query=sorgu;
            console.log(query);
            sql.query(connectionString,query,(err,rows) => {
                console.log(rows)       
            })
        }
        else{
            console.log("bu url zaten var.")
        }
      
    }
    else{
        res.status(422).send("Url geçersiz.")
    }
    res.send("http://localhost:3000/"+shortUrl);
})


app.get("/:shortUrl", async (req,res,next) => {
    const {shortUrl} = req.params
    let longurl;
   
    var sorgu = `select long_url from urls where short_url='${shortUrl}'`
    console.log(sorgu)
    const query=sorgu;
    sql.query(connectionString,query,(err,rows) => {
        longurl = rows[0].long_url;
        console.log(longurl)
        res.redirect(longurl)
    })
    
})

async function generateRandomUrl(){
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < 6; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


async function isExistUrl(url){
    var isExist
    var sorgu = `select long_url from urls where '${url}'=long_url`
    const query=sorgu;
    sql.query(connectionString,query,(err,rows) => {
        return rows;
    })
    
    
}

app.listen(3000, () => console.log("on port 3000..."))
