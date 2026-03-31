// عناصر الصفحة
const intro = document.getElementById("intro");
const continueBtn = document.getElementById("continueBtn");
const welcome = document.getElementById("welcome");
const start = document.getElementById("start");
const diagnosis = document.getElementById("diagnosis");

const imgInput = document.getElementById("imgInput");
const preview = document.getElementById("preview");
const check = document.getElementById("check");
const result = document.getElementById("result");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const darkToggle = document.getElementById("darkToggle");
const langSelect = document.getElementById("langSelect");
const soundToggle = document.getElementById("soundToggle");
const tipsToggle = document.getElementById("tipsToggle");

const infoBtn = document.getElementById("infoBtn");
const popup = document.getElementById("colorPopup");
const closePopup = document.getElementById("closePopup");

let lang="en", soundEnabled=true, tipsEnabled=true;

// بيانات النباتات
const data=[
  { plant_en:"Tomato", plant_ar:"طماطم", problem_en:"Fungal infection", problem_ar:"إصابة فطرية", treatment_en:"Use fungicide", treatment_ar:"استخدم مبيد فطري"},
  { plant_en:"Cucumber", plant_ar:"خيار", problem_en:"Nitrogen deficiency", problem_ar:"نقص نيتروجين", treatment_en:"Add fertilizer", treatment_ar:"أضف سماد"},
  { plant_en:"Pepper", plant_ar:"فلفل", problem_en:"Whitefly attack", problem_ar:"هجوم الذبابة البيضاء", treatment_en:"Use insecticide", treatment_ar:"استخدم مبيد حشري"}
];

// Tips
function getTips(problem){
  if(problem==="Fungal infection") return {en:["Avoid humidity","Remove infected leaves","Use fungicide"], ar:["تجنب الرطوبة","إزالة الأوراق المصابة","استخدام مبيد فطري"]};
  if(problem==="Nitrogen deficiency") return {en:["Add fertilizer","Improve soil","Water regularly"], ar:["إضافة سماد","تحسين التربة","الري بانتظام"]};
  if(problem==="Whitefly attack") return {en:["Use insecticide","Clean leaves","Check daily"], ar:["استخدام مبيد","تنظيف الأوراق","فحص يومي"]};
}

// صوت خفيف
function sound(){
  if(!soundEnabled) return;
  const ctx=new AudioContext();
  const o=ctx.createOscillator();
  const g=ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  g.gain.value=0.05;
  o.start(); o.stop(ctx.currentTime+0.05);
}

// تحديث اللغة
function updateLanguage(){
  document.getElementById("appDesc").innerText = lang==="en"?"Detect plant diseases and get treatment tips easily!":"اكتشف أمراض النباتات واحصل على نصائح العلاج بسهولة!";
  document.getElementById("title").innerText = lang==="en"?"Welcome 👋":"مرحبًا 👋";
  document.getElementById("desc").innerText = lang==="en"?"Upload a plant leaf image and we will help you detect diseases and suggest treatments easily.":"ارفع صورة ورقة النبات وسنساعدك في اكتشاف المرض واقتراح العلاج بسهولة";
  document.getElementById("start").innerText = lang==="en"?"Start Diagnosis":"ابدأ التشخيص";
  document.getElementById("uploadText").innerText = lang==="en"?"Upload Image":"ارفع صورة";
  document.getElementById("check").innerText = lang==="en"?"Diagnose":"تشخيص";

  if(lang==="ar") document.body.classList.add("rtl");
  else document.body.classList.remove("rtl");

  document.getElementById("colorTitle").innerText = lang==="en"?"Color Guide":"دليل الألوان";
  closePopup.innerText = lang==="en"?"Close":"إغلاق";

  const pTags=popup.querySelectorAll("p");
  pTags[0].innerText = lang==="en"?"🔴 Fungal Infection":"🔴 إصابة فطرية";
  pTags[1].innerText = lang==="en"?"🟡 Nutrient Deficiency":"🟡 نقص العناصر";
  pTags[2].innerText = lang==="en"?"🟢 Insect Attack":"🟢 هجوم حشرات";
}

// Intro Continue
continueBtn.addEventListener("click", ()=>{
  sound();
  intro.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// Start Welcome
start.addEventListener("click", ()=>{
  sound();
  welcome.classList.add("hidden");
  diagnosis.classList.remove("hidden");
});

// عرض الصورة
imgInput.addEventListener("change", ()=>{
  preview.src=URL.createObjectURL(imgInput.files[0]);
  preview.style.display="block";
});

// تشخيص
check.addEventListener("click", ()=>{
  sound();
  if(!imgInput.files[0]){alert(lang==="en"?"Upload image":"ارفع صورة"); return;}
  const random = data[Math.floor(Math.random()*data.length)];
  document.body.classList.remove("bg-fungal","bg-nutrient","bg-insect");
  if(random.problem_en==="Fungal infection") document.body.classList.add("bg-fungal");
  if(random.problem_en==="Nitrogen deficiency") document.body.classList.add("bg-nutrient");
  if(random.problem_en==="Whitefly attack") document.body.classList.add("bg-insect");

  let tipsHTML="";
  if(tipsEnabled){
    const tips=getTips(random.problem_en);
    const tipsArr=lang==="en"?tips.en:tips.ar;
    tipsHTML=tipsArr.map(t=>`<li>${t}</li>`).join("");
  }

  result.innerHTML=`
  <div class="result-card">
    <h3>🌿 ${lang==="en"?random.plant_en:random.plant_ar}</h3>
    <p><b>${lang==="en"?"Problem":"المشكلة"}:</b> ${lang==="en"?random.problem_en:random.problem_ar}</p>
    <p><b>${lang==="en"?"Treatment":"العلاج"}:</b> ${lang==="en"?random.treatment_en:random.treatment_ar}</p>
    ${tipsEnabled?`<div class="tips"><h4>💡 ${lang==="en"?"Tips":"نصائح"}:</h4><ul>${tipsHTML}</ul></div>`:""}
  </div>`;
});

// Settings Panel
settingsBtn.addEventListener("click", ()=>{settingsPanel.classList.toggle("hidden");});
darkToggle.addEventListener("change", ()=>{document.body.classList.toggle("dark", darkToggle.checked); localStorage.setItem("theme", darkToggle.checked?"dark":"light");});
langSelect.addEventListener("change", ()=>{lang=langSelect.value; localStorage.setItem("lang", lang); updateLanguage();});
soundToggle.addEventListener("change", ()=>{soundEnabled=soundToggle.checked; localStorage.setItem("sound", soundEnabled?"on":"off");});
tipsToggle.addEventListener("change", ()=>{tipsEnabled=tipsToggle.checked; localStorage.setItem("tips", tipsEnabled?"on":"off");});

// Popup
infoBtn.addEventListener("click", ()=>{popup.classList.remove("hidden");});
closePopup.addEventListener("click", ()=>{popup.classList.add("hidden");});

// Load Settings
window.onload=()=>{
  if(localStorage.getItem("theme")==="dark"){document.body.classList.add("dark"); darkToggle.checked=true;}
  const savedLang=localStorage.getItem("lang");
  if(savedLang){lang=savedLang; langSelect.value=savedLang;}
  const savedSound=localStorage.getItem("sound");
  if(savedSound){soundEnabled=savedSound==="on"; soundToggle.checked=soundEnabled;}
  const savedTips=localStorage.getItem("tips");
  if(savedTips){tipsEnabled=savedTips==="on"; tipsToggle.checked=tipsEnabled;}
  updateLanguage();
};