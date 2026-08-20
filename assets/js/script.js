"use strict";

document.addEventListener("DOMContentLoaded",()=>{
const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

const welcomeBar=$("#welcomeBar");
if(welcomeBar){
document.body.classList.add("welcome-active");
setTimeout(()=>{
welcomeBar.classList.add("hide");
document.body.classList.remove("welcome-active");
},2500);
}

const menuToggle=$("#menuToggle");
const navigation=$("#navigation");
const header=$(".header");

function fecharMenu(){
if(!navigation||!menuToggle)return;
navigation.classList.remove("active");
menuToggle.setAttribute("aria-expanded","false");
menuToggle.setAttribute("aria-label","Abrir menu");
menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';
}

menuToggle?.addEventListener("click",()=>{
if(!navigation)return;
const ativo=navigation.classList.toggle("active");
menuToggle.setAttribute("aria-expanded",String(ativo));
menuToggle.setAttribute("aria-label",ativo?"Fechar menu":"Abrir menu");
menuToggle.innerHTML=ativo?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
});

$$(".navigation a").forEach(link=>link.addEventListener("click",fecharMenu));

function atualizarHeader(){
header?.classList.toggle("scrolled",window.scrollY>40);
}

window.addEventListener("scroll",atualizarHeader,{passive:true});
atualizarHeader();

const slides=$$(".slide");
const dots=$$(".dot");
const nextSlide=$("#nextSlide");
const prevSlide=$("#prevSlide");
const hero=$(".hero");
let currentSlide=0;
let sliderInterval=null;
let touchStart=0;

function showSlide(index){
if(!slides.length)return;
currentSlide=(index+slides.length)%slides.length;
slides.forEach((slide,i)=>slide.classList.toggle("active",i===currentSlide));
dots.forEach((dot,i)=>dot.classList.toggle("active",i===currentSlide));
}

function startSlider(){
clearInterval(sliderInterval);
if(slides.length>1)sliderInterval=setInterval(()=>showSlide(currentSlide+1),6000);
}

function stopSlider(){
clearInterval(sliderInterval);
sliderInterval=null;
}

nextSlide?.addEventListener("click",()=>{
showSlide(currentSlide+1);
startSlider();
});

prevSlide?.addEventListener("click",()=>{
showSlide(currentSlide-1);
startSlider();
});

dots.forEach((dot,index)=>{
dot.addEventListener("click",()=>{
showSlide(index);
startSlider();
});
});

hero?.addEventListener("mouseenter",stopSlider);
hero?.addEventListener("mouseleave",startSlider);

hero?.addEventListener("touchstart",event=>{
const touch=event.changedTouches[0];
if(!touch)return;
touchStart=touch.screenX;
stopSlider();
},{passive:true});

hero?.addEventListener("touchend",event=>{
const touch=event.changedTouches[0];
if(!touch)return;
const difference=touchStart-touch.screenX;
if(Math.abs(difference)>50)showSlide(difference>0?currentSlide+1:currentSlide-1);
startSlider();
},{passive:true});

showSlide(0);
startSlider();

$$(".flip-card").forEach(card=>{
card.addEventListener("click",event=>{
if(event.target.closest("a"))return;
card.classList.toggle("active");
});
});

const year=$("#year");
if(year)year.textContent=new Date().getFullYear();

const form=$("#contactForm");
const formMessage=$("#formMessage");

form?.addEventListener("submit",event=>{
event.preventDefault();
if(!form.checkValidity()){
form.reportValidity();
return;
}

const name=$("#name")?.value.trim()||"";
const email=$("#email")?.value.trim()||"";
const message=$("#message")?.value.trim()||"";
const assunto=encodeURIComponent(`Contato pelo site - ${name}`);
const corpo=encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`);

if(formMessage){
formMessage.textContent="Abrindo seu aplicativo de e-mail...";
formMessage.style.display="block";
formMessage.style.color="#16803c";
}

window.location.href=`mailto:contato@ibrg.com.br?subject=${assunto}&body=${corpo}`;
});

const dailyVerse=$("#dailyVerse");
const verseReference=$("#verseReference");
const verseLink=$("#verseLink");
const newVerse=$("#newVerse");

const verses=[
["Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna.","João 3:16","https://www.bible.com/pt/bible/129/JHN.3.16.NVI"],
["O Senhor é o meu pastor; nada me faltará.","Salmos 23:1","https://www.bible.com/pt/bible/129/PSA.23.1.NVI"],
["Tudo posso naquele que me fortalece.","Filipenses 4:13","https://www.bible.com/pt/bible/129/PHP.4.13.NVI"],
["Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.","Salmos 37:5","https://www.bible.com/pt/bible/129/PSA.37.5.NVI"],
["Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.","Isaías 41:10","https://www.bible.com/pt/bible/129/ISA.41.10.NVI"],
["Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.","João 14:6","https://www.bible.com/pt/bible/129/JHN.14.6.NVI"],
["Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.","Mateus 6:33","https://www.bible.com/pt/bible/129/MAT.6.33.NVI"],
["Sede fortes e corajosos; não temais, nem vos assusteis.","Deuteronômio 31:6","https://www.bible.com/pt/bible/129/DEU.31.6.NVI"]
];

function showVerse(index){
if(!dailyVerse||!verseReference)return;
const verse=verses[index];
if(!verse)return;
dailyVerse.textContent=`“${verse[0]}”`;
verseReference.textContent=verse[1];
if(verseLink)verseLink.href=verse[2];
}

showVerse(Math.floor(Math.random()*verses.length));

newVerse?.addEventListener("click",()=>{
let index=Math.floor(Math.random()*verses.length);
showVerse(index);
});

const bookNames={
GEN:"Gênesis",EXO:"Êxodo",LEV:"Levítico",NUM:"Números",DEU:"Deuteronômio",
JOS:"Josué",JDG:"Juízes",RUT:"Rute","1SA":"1 Samuel","2SA":"2 Samuel",
"1KI":"1 Reis","2KI":"2 Reis","1CH":"1 Crônicas","2CH":"2 Crônicas",
EZR:"Esdras",NEH:"Neemias",EST:"Ester",JOB:"Jó",PSA:"Salmos",PRO:"Provérbios",
ECC:"Eclesiastes",SNG:"Cânticos",ISA:"Isaías",JER:"Jeremias",LAM:"Lamentações",
EZK:"Ezequiel",DAN:"Daniel",HOS:"Oseias",JOL:"Joel",AMO:"Amós",OBA:"Obadias",
JON:"Jonas",MIC:"Miqueias",NAH:"Naum",HAB:"Habacuque",ZEP:"Sofonias",
HAG:"Ageu",ZEC:"Zacarias",MAL:"Malaquias",MAT:"Mateus",MAR:"Marcos",
LUK:"Lucas",JHN:"João",ACT:"Atos",ROM:"Romanos","1CO":"1 Coríntios",
"2CO":"2 Coríntios",GAL:"Gálatas",EPH:"Efésios",PHP:"Filipenses",
COL:"Colossenses","1TH":"1 Tessalonicenses","2TH":"2 Tessalonicenses",
"1TI":"1 Timóteo","2TI":"2 Timóteo",TIT:"Tito",PHM:"Filemom",HEB:"Hebreus",
JAS:"Tiago","1PE":"1 Pedro","2PE":"2 Pedro","1JN":"1 João","2JN":"2 João",
"3JN":"3 João",JUD:"Judas",REV:"Apocalipse"
};

const bookChapterCounts={
"Gênesis":50,"Êxodo":40,"Levítico":27,"Números":36,"Deuteronômio":34,
"Josué":24,"Juízes":21,"Rute":4,"1 Samuel":31,"2 Samuel":24,"1 Reis":22,
"2 Reis":25,"1 Crônicas":29,"2 Crônicas":36,"Esdras":10,"Neemias":13,
"Ester":10,"Jó":42,"Salmos":150,"Provérbios":31,"Eclesiastes":12,"Cânticos":8,
"Isaías":66,"Jeremias":52,"Lamentações":5,"Ezequiel":48,"Daniel":12,
"Oseias":14,"Joel":3,"Amós":9,"Obadias":1,"Jonas":4,"Miqueias":7,"Naum":3,
"Habacuque":3,"Sofonias":3,"Ageu":2,"Zacarias":14,"Malaquias":4,"Mateus":28,
"Marcos":16,"Lucas":24,"João":21,"Atos":28,"Romanos":16,"1 Coríntios":16,
"2 Coríntios":13,"Gálatas":6,"Efésios":6,"Filipenses":4,"Colossenses":4,
"1 Tessalonicenses":5,"2 Tessalonicenses":3,"1 Timóteo":6,"2 Timóteo":4,
"Tito":3,"Filemom":1,"Hebreus":13,"Tiago":5,"1 Pedro":5,"2 Pedro":3,
"1 João":5,"2 João":1,"3 João":1,"Judas":1,"Apocalipse":22
};

const bookSelect=$("#bookSelect");
const chapterInput=$("#chapterInput");
const readChapter=$("#readChapter");
const bibleReader=$("#bibleReader");
const readerResult=$("#readerResult");
const readerTitle=$("#readerTitle");
const closeReader=$("#closeReader");
const externalChapterLink=$("#externalChapterLink");

function getBibleUrl(book,chapter){
return `https://www.bible.com/pt/bible/129/${book}.${chapter}.NVI`;
}

async function loadBibleChapter(){
if(!bookSelect||!chapterInput||!readerResult)return;

const book=bookSelect.value;
const bookName=bookNames[book];
const chapter=Number(chapterInput.value);
const maxChapter=bookChapterCounts[bookName];

if(!bookName){
readerResult.innerHTML='<div class="reader-error"><i class="fa-solid fa-circle-exclamation"></i><p>Livro bíblico inválido.</p></div>';
return;
}

if(!Number.isInteger(chapter)||chapter<1){
readerResult.innerHTML='<div class="reader-error"><i class="fa-solid fa-circle-exclamation"></i><p>Informe um capítulo válido.</p></div>';
return;
}

if(chapter>maxChapter){
readerResult.innerHTML=`<div class="reader-error"><i class="fa-solid fa-circle-exclamation"></i><p>${bookName} possui apenas ${maxChapter} capítulo${maxChapter>1?"s":""}.</p></div>`;
return;
}

if(readerTitle)readerTitle.textContent=`${bookName} ${chapter}`;
bibleReader?.removeAttribute("hidden");
bibleReader?.classList.add("active");
readerResult.innerHTML='<div class="reader-loading"><i class="fa-solid fa-spinner fa-spin"></i><p>Carregando a leitura...</p></div>';

const bibleUrl=getBibleUrl(book,chapter);
if(externalChapterLink)externalChapterLink.href=bibleUrl;

try{
const url=`https://bible-api.com/${encodeURIComponent(bookName)}%20${chapter}?translation=almeida`;
const response=await fetch(url,{headers:{Accept:"application/json"}});

if(!response.ok)throw new Error("Falha ao carregar");

const data=await response.json();

if(!Array.isArray(data.verses)||!data.verses.length)throw new Error("Capítulo não encontrado");

readerResult.innerHTML="";

data.verses.forEach(verse=>{
const p=document.createElement("p");
p.className="bible-verse";

const number=document.createElement("strong");
number.textContent=`${verse.verse} `;

p.append(number,document.createTextNode(String(verse.text||"").trim()));
readerResult.appendChild(p);
});
}catch(error){
readerResult.innerHTML='<div class="reader-error"><i class="fa-solid fa-circle-exclamation"></i><p>Não foi possível carregar esta leitura agora.</p><p>Você pode continuar sua leitura pelo Bible.com.</p></div>';
}
}

readChapter?.addEventListener("click",loadBibleChapter);

chapterInput?.addEventListener("keydown",event=>{
if(event.key==="Enter"){
event.preventDefault();
loadBibleChapter();
}
});

closeReader?.addEventListener("click",()=>{
bibleReader?.classList.remove("active");
bibleReader?.setAttribute("hidden","");
});

const bibleBooks=[
["Gênesis",50],["Êxodo",40],["Levítico",27],["Números",36],["Deuteronômio",34],
["Josué",24],["Juízes",21],["Rute",4],["1 Samuel",31],["2 Samuel",24],
["1 Reis",22],["2 Reis",25],["1 Crônicas",29],["2 Crônicas",36],["Esdras",10],
["Neemias",13],["Ester",10],["Jó",42],["Salmos",150],["Provérbios",31],
["Eclesiastes",12],["Cânticos",8],["Isaías",66],["Jeremias",52],
["Lamentações",5],["Ezequiel",48],["Daniel",12],["Oseias",14],["Joel",3],
["Amós",9],["Obadias",1],["Jonas",4],["Miqueias",7],["Naum",3],
["Habacuque",3],["Sofonias",3],["Ageu",2],["Zacarias",14],["Malaquias",4],
["Mateus",28],["Marcos",16],["Lucas",24],["João",21],["Atos",28],
["Romanos",16],["1 Coríntios",16],["2 Coríntios",13],["Gálatas",6],
["Efésios",6],["Filipenses",4],["Colossenses",4],["1 Tessalonicenses",5],
["2 Tessalonicenses",3],["1 Timóteo",6],["2 Timóteo",4],["Tito",3],
["Filemom",1],["Hebreus",13],["Tiago",5],["1 Pedro",5],["2 Pedro",3],
["1 João",5],["2 João",1],["3 João",1],["Judas",1],["Apocalipse",22]
];

function createAnnualPlan(){
const totalChapters=bibleBooks.reduce((total,book)=>total+book[1],0);
const base=Math.floor(totalChapters/365);
const extra=totalChapters%365;
const plan=[];
let bookIndex=0;
let chapter=1;

for(let day=1;day<=365;day++){
let chaptersToday=base+(day<=extra?1:0);
const ranges=[];

while(chaptersToday>0&&bookIndex<bibleBooks.length){
const book=bibleBooks[bookIndex][0];
const total=bibleBooks[bookIndex][1];
const available=total-chapter+1;
const amount=Math.min(chaptersToday,available);
const start=chapter;
const end=start+amount-1;

ranges.push({book,start,end});
chaptersToday-=amount;

if(end>=total){
bookIndex++;
chapter=1;
}else{
chapter=end+1;
}
}

plan.push({day,ranges});
}

return plan;
}

function getStorageNumber(key,fallback){
try{
const value=Number(localStorage.getItem(key));
return Number.isFinite(value)?value:fallback;
}catch{
return fallback;
}

}

function setStorage(key,value){
try{
localStorage.setItem(key,String(value));
}catch{}
}

const annualPlan=createAnnualPlan();
const readingList=$("#readingList");

let currentDay=getStorageNumber("annualCurrentDay",1);
let completedDays=getStorageNumber("annualCompletedDays",0);
const currentYear=new Date().getFullYear();
const savedYear=getStorageNumber("annualPlanYear",currentYear);

if(savedYear!==currentYear){
currentDay=1;
completedDays=0;
setStorage("annualPlanYear",currentYear);
setStorage("annualCurrentDay",1);
setStorage("annualCompletedDays",0);
}

currentDay=Math.max(1,Math.min(365,Math.floor(currentDay)));
completedDays=Math.max(0,Math.min(365,Math.floor(completedDays)));

function formatRange(range){
return range.start===range.end?`${range.book} ${range.start}`:`${range.book} ${range.start}–${range.end}`;
}

function getRangeUrl(range){
return getBibleUrl(
Object.keys(bookNames).find(code=>bookNames[code]===range.book)||"GEN",
range.start
);
}

function formatReadingDate(day){
const date=new Date(currentYear,0,day);
return date.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"});
}

function createReadingCard(reading){
const card=document.createElement("article");
card.className="reading-day";
card.dataset.day=reading.day;

if(reading.day===currentDay)card.classList.add("current");
if(reading.day<=completedDays)card.classList.add("completed");

const header=document.createElement("div");
header.className="reading-day-header";

const number=document.createElement("span");
number.className="reading-day-number";
number.textContent=`Dia ${reading.day}`;

const date=document.createElement("span");
date.className="reading-day-date";
date.textContent=formatReadingDate(reading.day);

header.append(number,date);

const title=document.createElement("h3");
title.className="reading-day-title";
title.textContent=reading.ranges.map(formatRange).join(" • ");

const actions=document.createElement("div");
actions.className="reading-day-actions";

const link=document.createElement("a");
link.className="reading-day-link";
link.href=getRangeUrl(reading.ranges[0]);
link.target="_blank";
link.rel="noopener noreferrer";
link.innerHTML='Ler <i class="fa-solid fa-arrow-up-right-from-square"></i>';

const button=document.createElement("button");
button.type="button";
button.className="reading-complete";

if(reading.day<=completedDays){
button.classList.add("done");
button.innerHTML='<i class="fa-solid fa-check"></i> Concluído';
}else{
button.innerHTML='<i class="fa-solid fa-check"></i> Concluir';
}

button.addEventListener("click",()=>{
if(reading.day>completedDays){
completedDays=reading.day;
currentDay=Math.min(reading.day+1,365);
setStorage("annualCompletedDays",completedDays);
setStorage("annualCurrentDay",currentDay);
renderAnnualPlan();
}else if(reading.day===completedDays&&completedDays>0){
completedDays--;
currentDay=reading.day;
setStorage("annualCompletedDays",completedDays);
setStorage("annualCurrentDay",currentDay);
renderAnnualPlan();
}
});

actions.append(link,button);
card.append(header,title,actions);

return card;
}

function renderAnnualPlan(){
if(!readingList)return;

readingList.innerHTML="";

annualPlan.forEach(reading=>{
readingList.appendChild(createReadingCard(reading));
});

const current=readingList.querySelector(".current");

if(current){
setTimeout(()=>{
current.scrollIntoView({behavior:"smooth",block:"center"});
},100);
}
}

renderAnnualPlan();

const calendarMonth=$("#calendarMonth");
const calendarYear=$("#calendarYear");
const calendarDays=$$(".calendar-day");
const prevWeek=$("#prevWeek");
const nextWeek=$("#nextWeek");
const todayWeek=$("#todayWeek");
const prevYear=$("#prevYear");
const nextYear=$("#nextYear");

if(calendarMonth&&calendarDays.length){
const eventos=[
{dia:0,titulo:"Consagração",horario:"08h30"},
{dia:0,titulo:"Escola Dominical",horario:"09h30 - 11h00"},
{dia:0,titulo:"Culto de Ação de Graças",horario:"18h00 - 19h00"},
{dia:2,titulo:"Culto de Conquistas",horario:"20h00 - 21h00"},
{dia:3,titulo:"Tarde de Bênção",horario:"15h00 - 16h30"},
{dia:3,titulo:"Intercessão",horario:"20h00 - 21h00"},
{dia:5,titulo:"Culto ao Espírito Santo",horario:"20h00 - 21h00"},
{dia:6,titulo:"Culto dos Jovens",horario:"19h00 - 20h00"}
];

let dataAtual=new Date();

function inicioSemana(data){
const d=new Date(data);
d.setHours(0,0,0,0);
d.setDate(d.getDate()-d.getDay());
return d;
}

function formatarMes(data){
const texto=data.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
return texto.charAt(0).toUpperCase()+texto.slice(1);
}

function mesmaData(a,b){
return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
}

function renderizarCalendario(){
const inicio=inicioSemana(dataAtual);
const hoje=new Date();

calendarMonth.textContent=formatarMes(inicio);
if(calendarYear)calendarYear.textContent=inicio.getFullYear();

calendarDays.forEach((card,index)=>{
const data=new Date(inicio);
data.setDate(inicio.getDate()+index);

const numero=$(".day-number",card);
const container=$(".day-events",card);

if(numero)numero.textContent=data.getDate();
if(!container)return;

container.innerHTML="";
card.classList.toggle("today",mesmaData(data,hoje));

const eventosDoDia=eventos.filter(evento=>evento.dia===data.getDay());

if(!eventosDoDia.length){
const vazio=document.createElement("span");
vazio.className="calendar-empty";
vazio.textContent="Sem programação";
container.appendChild(vazio);
return;
}

eventosDoDia.forEach(evento=>{
const item=document.createElement("div");
item.className="calendar-event";

const title=document.createElement("strong");
title.textContent=evento.titulo;

const time=document.createElement("span");
time.textContent=evento.horario;

item.append(title,time);
container.appendChild(item);
});
});
}

prevWeek?.addEventListener("click",()=>{
dataAtual.setDate(dataAtual.getDate()-7);
renderizarCalendario();
});

nextWeek?.addEventListener("click",()=>{
dataAtual.setDate(dataAtual.getDate()+7);
renderizarCalendario();
});

todayWeek?.addEventListener("click",()=>{
dataAtual=new Date();
renderizarCalendario();
});

prevYear?.addEventListener("click",()=>{
dataAtual.setFullYear(dataAtual.getFullYear()-1);
renderizarCalendario();
});

nextYear?.addEventListener("click",()=>{
dataAtual.setFullYear(dataAtual.getFullYear()+1);
renderizarCalendario();
});

renderizarCalendario();
}

const noticiaContainer=$("#noticia");
const pontosContainer=$("#pontos");
const fgPrev=$("#fgPrev");
const fgNext=$("#fgNext");
const fgNews=$(".fg-news");

let noticias=[];
let noticiaAtual=0;
let newsInterval=null;

const noticiasPadrao=[
{titulo:"Notícias do mundo cristão",descricao:"Acompanhe as principais notícias do mundo cristão.",categoria:"FG News",data:"Folha Gospel",imagem:"",link:"https://folhagospel.com/"},
{titulo:"Igrejas e cristãos em destaque",descricao:"Confira acontecimentos recentes relacionados à fé cristã.",categoria:"FG News",data:"Folha Gospel",imagem:"",link:"https://folhagospel.com/"},
{titulo:"Fé, igreja e atualidades",descricao:"Informação sobre igreja, sociedade e vida cristã.",categoria:"FG News",data:"Folha Gospel",imagem:"",link:"https://folhagospel.com/"}
];

function atualizarPontos(){
if(!pontosContainer)return;
$$(".fg-ponto",pontosContainer).forEach((ponto,index)=>{
ponto.classList.toggle("ativo",index===noticiaAtual);
});
}

function criarPontos(){
if(!pontosContainer)return;
pontosContainer.innerHTML="";

noticias.forEach((_,index)=>{
const button=document.createElement("button");
button.type="button";
button.className="fg-ponto";
button.setAttribute("aria-label",`Ir para notícia ${index+1}`);

button.addEventListener("click",()=>{
noticiaAtual=index;
mostrarNoticia();
iniciarNoticias();
});

pontosContainer.appendChild(button);
});

atualizarPontos();
}

function mostrarNoticia(){
if(!noticiaContainer||!noticias.length)return;

noticiaAtual=(noticiaAtual+noticias.length)%noticias.length;

const noticia=noticias[noticiaAtual];
const card=document.createElement("article");
card.className="fg-card";

const imagem=document.createElement("div");
imagem.className="fg-imagem";

if(noticia.imagem){
const img=document.createElement("img");
img.src=noticia.imagem;
img.alt=noticia.titulo;
img.loading="lazy";
img.onerror=()=>{
imagem.classList.add("sem-imagem");
img.remove();
};
imagem.appendChild(img);
}else{
imagem.classList.add("sem-imagem");
}

const conteudo=document.createElement("div");
conteudo.className="fg-conteudo";

const categoria=document.createElement("span");
categoria.className="fg-categoria";
categoria.textContent=noticia.categoria||"FG News";

const titulo=document.createElement("h2");
titulo.textContent=noticia.titulo;

const descricao=document.createElement("p");
descricao.textContent=noticia.descricao||"Confira esta notícia.";

const data=document.createElement("span");
data.className="fg-data";
data.textContent=noticia.data||"Folha Gospel";

const link=document.createElement("a");
link.className="fg-ler";
link.href=noticia.link||"https://folhagospel.com/";
link.target="_blank";
link.rel="noopener noreferrer";
link.textContent="Ler notícia";

conteudo.append(categoria,titulo,descricao,data,link);
card.append(imagem,conteudo);
noticiaContainer.replaceChildren(card);

atualizarPontos();
}

function proximaNoticia(){
if(!noticias.length)return;
noticiaAtual=(noticiaAtual+1)%noticias.length;
mostrarNoticia();
}

function noticiaAnterior(){
if(!noticias.length)return;
noticiaAtual=(noticiaAtual-1+noticias.length)%noticias.length;
mostrarNoticia();
}

function iniciarNoticias(){
clearInterval(newsInterval);
newsInterval=null;
if(noticias.length>1)newsInterval=setInterval(proximaNoticia,7000);
}

fgNext?.addEventListener("click",()=>{
proximaNoticia();
iniciarNoticias();
});

fgPrev?.addEventListener("click",()=>{
noticiaAnterior();
iniciarNoticias();
});

fgNews?.addEventListener("mouseenter",()=>clearInterval(newsInterval));
fgNews?.addEventListener("mouseleave",iniciarNoticias);

async function carregarNoticias(){
noticias=[...noticiasPadrao];
noticiaAtual=0;
criarPontos();
mostrarNoticia();

try{
const feed=encodeURIComponent("https://folhagospel.com/feed/");
const url=`https://api.rss2json.com/v1/api.json?rss_url=${feed}&count=10`;
const resposta=await fetch(url,{cache:"no-store"});

if(!resposta.ok)throw new Error("Falha no feed");

const dados=await resposta.json();

if(!Array.isArray(dados.items)||!dados.items.length)throw new Error("Sem notícias");

const novas=dados.items.map(item=>{
const descricaoHTML=document.createElement("div");
descricaoHTML.innerHTML=item.description||"";

const texto=descricaoHTML.textContent.replace(/\s+/g," ").trim();

return{
titulo:item.title||"Notícia",
descricao:texto.slice(0,180),
categoria:"Notícias Gospel",
data:item.pubDate?new Date(item.pubDate).toLocaleDateString("pt-BR"):"Folha Gospel",
imagem:item.thumbnail||item.enclosure?.link||"",
link:item.link||"https://folhagospel.com/"
};
}).filter(item=>item.titulo&&item.link);

if(novas.length){
noticias=novas;
noticiaAtual=0;
criarPontos();
mostrarNoticia();
}
}catch(error){
console.warn("Não foi possível carregar as notícias:",error);
}

iniciarNoticias();
}

if(noticiaContainer){
carregarNoticias();
setInterval(carregarNoticias,1800000);
}
});