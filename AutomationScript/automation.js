let puppeteer=require("puppeteer");
let data=require("./config.json");
let newtitle;
let img;
let p="";
let browser;
(async function() {
 browser=await puppeteer.launch({headless:false,defaultViewport:null,args:["--start-maximized"]});
 let pages=await browser.pages();
 let page=pages[0];
 await page.goto("https://www.businesstoday.in/coronavirus-diaries/coronavirus-vaccine");
 await page.waitForSelector(".sbiInfo h2")
 const options = await page.$$eval('.sbiInfo h2', (options) =>
  options.map((option) => option.textContent.trim())
);
newtitle=options[0];
const images= await page.$$eval('.sbiInfo img', (images) =>
images.map(option => option.getAttribute("src"))
);
 img=images[0];


await Promise.all([
    page.waitForNavigation(),
    page.click(".sbiInfo img")
])

const o = await page.$$eval('.story-right p', (o) =>
  o.map((option) => option.textContent.trim())
);


 for( let i=1;i<o.length - 1;i++){
   p+=o[i];
 }
 await page.close();
 await addBlog();

})();


async function addBlog(){
  let npage=await browser.newPage();
  await npage.goto("https://blogdude.herokuapp.com/");
  await npage.waitForSelector(".btn.btn-info.btn-lg");
  await Promise.all([
      npage.waitForNavigation(),
      npage.click(".btn.btn-info.btn-lg")
  ])
  
  await npage.waitForSelector("[name='username']");
  await npage.type("[name='username']",data.username);
  await npage.waitForSelector("[name='password']");
  await npage.type("[name='password']",data.password);
  await npage.click(".btn.btn-neutral.btn-round.btn-block");
  await npage.waitForSelector(".btn.btn-danger.btn-large");
  await Promise.all([
      npage.waitForNavigation(),
      npage.click(".btn.btn-danger.btn-large")
  ])
  await npage.type("[name='title']",newtitle);
  await npage.type("[name='image']",img);
  await npage.type("[name='description']",p);
  await npage.waitForSelector("[type='submit']");
  await Promise.all([
    npage.waitForNavigation(),
    npage.click("[type='submit']")
])
 
 
}

