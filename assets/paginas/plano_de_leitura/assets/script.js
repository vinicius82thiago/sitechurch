
const bibleBooks = [
  ["Gênesis",50],["Êxodo",40],["Levítico",27],["Números",36],
  ["Deuteronômio",34],["Josué",24],["Juízes",21],["Rute",4],
  ["1 Samuel",31],["2 Samuel",24],["1 Reis",22],["2 Reis",25],
  ["1 Crônicas",29],["2 Crônicas",36],["Esdras",10],["Neemias",13],
  ["Ester",10],["Jó",42],["Salmos",150],["Provérbios",31],
  ["Eclesiastes",12],["Cânticos",8],["Isaías",66],["Jeremias",52],
  ["Lamentações",5],["Ezequiel",48],["Daniel",12],["Oséias",14],
  ["Joel",3],["Amós",9],["Obadias",1],["Jonas",4],["Miquéias",7],
  ["Naum",3],["Habacuque",3],["Sofonias",3],["Ageu",2],
  ["Zacarias",14],["Malaquias",4],["Mateus",28],["Marcos",16],
  ["Lucas",24],["João",21],["Atos",28],["Romanos",16],
  ["1 Coríntios",16],["2 Coríntios",13],["Gálatas",6],["Efésios",6],
  ["Filipenses",4],["Colossenses",4],["1 Tessalonicenses",5],
  ["2 Tessalonicenses",3],["1 Timóteo",6],["2 Timóteo",4],
  ["Tito",3],["Filemom",1],["Hebreus",13],["Tiago",5],
  ["1 Pedro",5],["2 Pedro",3],["1 João",5],["2 João",1],
  ["3 João",1],["Judas",1],["Apocalipse",22]
];

let readings=[];
let planData=[];

function createBibleChapters(){
  const chapters=[];
  bibleBooks.forEach(([book,total])=>{
    for(let chapter=1;chapter<=total;chapter++){
      chapters.push({book,chapter});
    }
  });
  return chapters;
}

function formatChapterRange(book,start,end){
  return start===end?`${book} ${start}`:`${book} ${start}–${end}`;
}

function generateReadings(totalDays){
  const chapters=createBibleChapters();
  const readings=[];
  const chaptersPerDay=chapters.length/totalDays;

  for(let day=0;day<totalDays;day++){
    const startIndex=Math.floor(day*chaptersPerDay);
    const endIndex=Math.floor((day+1)*chaptersPerDay);
    const dayChapters=chapters.slice(startIndex,endIndex);

    if(!dayChapters.length)continue;

    const groups=[];
    let currentBook=null;
    let startChapter=null;
    let endChapter=null;

    dayChapters.forEach(item=>{
      if(currentBook===null){
        currentBook=item.book;
        startChapter=item.chapter;
        endChapter=item.chapter;
      }else if(item.book===currentBook&&item.chapter===endChapter+1){
        endChapter=item.chapter;
      }else{
        groups.push(formatChapterRange(currentBook,startChapter,endChapter));
        currentBook=item.book;
        startChapter=item.chapter;
        endChapter=item.chapter;
      }
    });

    if(currentBook!==null){
      groups.push(formatChapterRange(currentBook,startChapter,endChapter));
    }

    readings.push(groups.join(" • "));
  }

  return readings;
}

function setDefaultDate(){
  const input=document.getElementById("startDate");
  if(input&&!input.value){
    input.value=formatDateInput(new Date());
  }
}

function formatDateInput(date){
  const year=date.getFullYear();
  const month=String(date.getMonth()+1).padStart(2,"0");
  const day=String(date.getDate()).padStart(2,"0");
  return `${year}-${month}-${day}`;
}

function generatePlan(){
  const startDateElement=document.getElementById("startDate");
  const totalDaysElement=document.getElementById("totalDays");

  if(!startDateElement||!totalDaysElement)return;

  const startDateValue=startDateElement.value;
  const totalDays=parseInt(totalDaysElement.value,10);

  if(!startDateValue){
    alert("Escolha uma data de início.");
    return;
  }

  if(!totalDays||totalDays<1){
    alert("Informe uma quantidade válida de dias.");
    return;
  }

  localStorage.setItem("readingStartDate",startDateValue);
  localStorage.setItem("readingTotalDays",totalDays);

  readings=generateReadings(totalDays);

  let saved={};

  try{
    saved=JSON.parse(localStorage.getItem("readingCompleted")||"{}");
  }catch{
    saved={};
  }

  planData=[];

  const startDate=new Date(startDateValue+"T00:00:00");

  for(let i=0;i<totalDays;i++){
    const date=new Date(startDate);
    date.setDate(startDate.getDate()+i);

    const dateKey=formatDateInput(date);

    planData.push({
      day:i+1,
      date:dateKey,
      reading:readings[i]||"Leitura não encontrada",
      completed:saved[dateKey]===true
    });
  }

  renderPlan();
}

function getStatus(item){
  if(item.completed)return"read";

  const today=new Date();
  today.setHours(0,0,0,0);

  const itemDate=new Date(item.date+"T00:00:00");

  if(itemDate<today)return"overdue";
  if(itemDate.getTime()===today.getTime())return"today";

  return"pending";
}

function getStatusText(status){
  switch(status){
    case"read":return"✓ Lido";
    case"overdue":return"⚠ Atrasado";
    case"today":return"📅 Hoje";
    default:return"⏳ Pendente";
  }
}

function formatDate(dateString){
  const date=new Date(dateString+"T00:00:00");

  return date.toLocaleDateString("pt-BR",{
    weekday:"long",
    day:"2-digit",
    month:"2-digit",
    year:"numeric"
  });
}

function renderPlan(){
  const container=document.getElementById("plan");

  if(!container)return;

  if(!planData.length){
    container.innerHTML='<div class="empty">Nenhum dia encontrado.</div>';
    return;
  }

  container.innerHTML=planData.map(item=>{
    const status=getStatus(item);

    return `
      <div class="day ${status}">
        <div class="day-header">
          <div>
            <div class="day-number">Dia ${item.day}</div>
            <div class="date">${formatDate(item.date)}</div>
          </div>
          <button class="${item.completed?"btn-unread":"btn-read"}" onclick="toggleRead('${item.date}')">
            ${item.completed?"↩ Desmarcar":"✓ Marcar como lido"}
          </button>
        </div>
        <div class="reading">📖 ${item.reading}</div>
        <span class="status ${status}">${getStatusText(status)}</span>
      </div>
    `;
  }).join("");

  updateProgress();
}

function toggleRead(date){
  const item=planData.find(x=>x.date===date);

  if(!item)return;

  item.completed=!item.completed;

  let saved={};

  try{
    saved=JSON.parse(localStorage.getItem("readingCompleted")||"{}");
  }catch{
    saved={};
  }

  if(item.completed){
    saved[date]=true;
  }else{
    delete saved[date];
  }

  localStorage.setItem("readingCompleted",JSON.stringify(saved));

  renderPlan();
}

function updateProgress(){
  const total=planData.length;
  const completed=planData.filter(item=>item.completed).length;
  const percentage=total===0?0:Math.round((completed/total)*100);

  const progressText=document.getElementById("progressText");
  const progressFill=document.getElementById("progressFill");
  const progressDetails=document.getElementById("progressDetails");

  if(progressText){
    progressText.textContent=percentage+"%";
  }

  if(progressFill){
    progressFill.style.width=percentage+"%";
  }

  if(progressDetails){
    progressDetails.textContent=`${completed} de ${total} dias concluídos`;
  }
}

function init(){
  const startDateElement=document.getElementById("startDate");
  const totalDaysElement=document.getElementById("totalDays");

  if(!startDateElement||!totalDaysElement)return;

  const savedDate=localStorage.getItem("readingStartDate");
  const savedTotal=localStorage.getItem("readingTotalDays");

  if(savedDate){
    startDateElement.value=savedDate;
  }else{
    setDefaultDate();
  }

  if(savedTotal){
    totalDaysElement.value=savedTotal;
  }else{
    totalDaysElement.value=365;
  }

  generatePlan();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}
