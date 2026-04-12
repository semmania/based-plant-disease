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

let lang = "en", soundEnabled = true, tipsEnabled = true;

// بيانات الـ 38 كلاس (PlantVillage)
const diseaseData = {
  "Apple___Apple_scab": { plant_en: "Apple", plant_ar: "تفاح", problem_en: "Apple Scab", problem_ar: "جرب التفاح", treatment_en: "Apply captan/mancozeb fungicide, remove infected leaves", treatment_ar: "استخدم مبيد فطري كابتان أو مانكوزيب وأزل الأوراق المصابة", type: "fungal" },
  "Apple___Black_rot": { plant_en: "Apple", plant_ar: "تفاح", problem_en: "Black Rot", problem_ar: "العفن الأسود", treatment_en: "Prune infected branches, apply copper-based fungicide", treatment_ar: "قلّم الفروع المصابة واستخدم مبيداً فطرياً نحاسياً", type: "fungal" },
  "Apple___Cedar_apple_rust": { plant_en: "Apple", plant_ar: "تفاح", problem_en: "Cedar Apple Rust", problem_ar: "صدأ التفاح", treatment_en: "Apply myclobutanil fungicide in spring", treatment_ar: "استخدم مبيداً فطرياً في الربيع وأزل الأشجار المجاورة المصابة", type: "fungal" },
  "Apple___healthy": { plant_en: "Apple", plant_ar: "تفاح", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Blueberry___healthy": { plant_en: "Blueberry", plant_ar: "توت أزرق", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Cherry___Powdery_mildew": { plant_en: "Cherry", plant_ar: "كرز", problem_en: "Powdery Mildew", problem_ar: "البياض الدقيقي", treatment_en: "Apply sulfur-based fungicide, improve air circulation", treatment_ar: "استخدم مبيداً كبريتياً وحسّن التهوية بين النباتات", type: "fungal" },
  "Cherry___healthy": { plant_en: "Cherry", plant_ar: "كرز", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Corn___Cercospora_leaf_spot": { plant_en: "Corn", plant_ar: "ذرة", problem_en: "Gray Leaf Spot", problem_ar: "تبقع الأوراق الرمادي", treatment_en: "Apply strobilurin fungicide, rotate crops", treatment_ar: "استخدم مبيداً فطرياً ودوّر المحاصيل", type: "fungal" },
  "Corn___Common_rust": { plant_en: "Corn", plant_ar: "ذرة", problem_en: "Common Rust", problem_ar: "الصدأ الشائع", treatment_en: "Apply fungicide early, use resistant varieties", treatment_ar: "استخدم مبيداً فطرياً مبكراً واختر أصناف مقاومة", type: "fungal" },
  "Corn___Northern_Leaf_Blight": { plant_en: "Corn", plant_ar: "ذرة", problem_en: "Northern Leaf Blight", problem_ar: "لفحة الأوراق الشمالية", treatment_en: "Apply propiconazole fungicide, remove crop residues", treatment_ar: "استخدم مبيداً فطرياً وأزل بقايا المحاصيل السابقة", type: "fungal" },
  "Corn___healthy": { plant_en: "Corn", plant_ar: "ذرة", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Grape___Black_rot": { plant_en: "Grape", plant_ar: "عنب", problem_en: "Black Rot", problem_ar: "العفن الأسود", treatment_en: "Apply mancozeb, remove mummified berries", treatment_ar: "استخدم مانكوزيب وأزل العناقيد المتحجرة", type: "fungal" },
  "Grape___Esca": { plant_en: "Grape", plant_ar: "عنب", problem_en: "Esca (Black Measles)", problem_ar: "مرض إيسكا", treatment_en: "Prune infected wood, seal cuts, avoid water stress", treatment_ar: "قلّم الخشب المصاب وافصل النباتات الشديدة التأثر", type: "fungal" },
  "Grape___Leaf_blight": { plant_en: "Grape", plant_ar: "عنب", problem_en: "Leaf Blight", problem_ar: "لفحة الأوراق", treatment_en: "Apply copper fungicide, improve air circulation", treatment_ar: "استخدم مبيداً نحاسياً وحسّن التهوية في المزرعة", type: "fungal" },
  "Grape___healthy": { plant_en: "Grape", plant_ar: "عنب", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Orange___Haunglongbing": { plant_en: "Orange", plant_ar: "برتقال", problem_en: "Citrus Greening (HLB)", problem_ar: "تخضر الحمضيات", treatment_en: "No cure. Remove infected trees, control psyllid insects", treatment_ar: "لا علاج له. أزل الأشجار المصابة وتحكم في حشرة السيليد", type: "bacterial" },
  "Peach___Bacterial_spot": { plant_en: "Peach", plant_ar: "خوخ", problem_en: "Bacterial Spot", problem_ar: "التبقع البكتيري", treatment_en: "Apply copper bactericide, avoid overhead irrigation", treatment_ar: "استخدم مبيداً بكتيرياً نحاسياً وتجنب الري بالرش", type: "bacterial" },
  "Peach___healthy": { plant_en: "Peach", plant_ar: "خوخ", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Pepper___Bacterial_spot": { plant_en: "Bell Pepper", plant_ar: "فلفل رومي", problem_en: "Bacterial Spot", problem_ar: "التبقع البكتيري", treatment_en: "Apply copper bactericide, use certified seeds", treatment_ar: "استخدم مبيداً بكتيرياً نحاسياً وبذوراً معقمة", type: "bacterial" },
  "Pepper___healthy": { plant_en: "Bell Pepper", plant_ar: "فلفل رومي", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Potato___Early_blight": { plant_en: "Potato", plant_ar: "بطاطس", problem_en: "Early Blight", problem_ar: "اللفحة المبكرة", treatment_en: "Apply chlorothalonil or mancozeb fungicide", treatment_ar: "استخدم مبيداً فطرياً وأزل الأوراق السفلية المصابة", type: "fungal" },
  "Potato___Late_blight": { plant_en: "Potato", plant_ar: "بطاطس", problem_en: "Late Blight", problem_ar: "اللفحة المتأخرة", treatment_en: "Apply metalaxyl immediately, destroy infected plants", treatment_ar: "استخدم ميتالاكسيل فوراً وأتلف النباتات المصابة", type: "fungal" },
  "Potato___healthy": { plant_en: "Potato", plant_ar: "بطاطس", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Raspberry___healthy": { plant_en: "Raspberry", plant_ar: "توت العليق", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Soybean___healthy": { plant_en: "Soybean", plant_ar: "فول الصويا", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Squash___Powdery_mildew": { plant_en: "Squash", plant_ar: "كوسة", problem_en: "Powdery Mildew", problem_ar: "البياض الدقيقي", treatment_en: "Apply potassium bicarbonate or sulfur spray", treatment_ar: "استخدم بيكربونات البوتاسيوم أو رش الكبريت", type: "fungal" },
  "Strawberry___Leaf_scorch": { plant_en: "Strawberry", plant_ar: "فراولة", problem_en: "Leaf Scorch", problem_ar: "احتراق الأوراق", treatment_en: "Apply captan fungicide, remove infected leaves", treatment_ar: "استخدم مبيد كابتان وأزل الأوراق المصابة", type: "fungal" },
  "Strawberry___healthy": { plant_en: "Strawberry", plant_ar: "فراولة", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
  "Tomato___Bacterial_spot": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Bacterial Spot", problem_ar: "التبقع البكتيري", treatment_en: "Apply copper bactericide, avoid overhead watering", treatment_ar: "استخدم مبيداً بكتيرياً نحاسياً وتجنب الري بالرش", type: "bacterial" },
  "Tomato___Early_blight": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Early Blight", problem_ar: "اللفحة المبكرة", treatment_en: "Apply chlorothalonil, remove lower infected leaves", treatment_ar: "استخدم مبيداً فطرياً وأزل الأوراق السفلية المصابة", type: "fungal" },
  "Tomato___Late_blight": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Late Blight", problem_ar: "اللفحة المتأخرة", treatment_en: "Apply metalaxyl immediately, remove infected plants", treatment_ar: "استخدم ميتالاكسيل فوراً وأزل النباتات المصابة", type: "fungal" },
  "Tomato___Leaf_Mold": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Leaf Mold", problem_ar: "عفن الأوراق", treatment_en: "Improve ventilation, apply copper fungicide", treatment_ar: "حسّن التهوية واستخدم مبيداً فطرياً نحاسياً", type: "fungal" },
  "Tomato___Septoria_leaf_spot": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Septoria Leaf Spot", problem_ar: "تبقع سبتوريا", treatment_en: "Apply mancozeb or chlorothalonil, remove infected leaves", treatment_ar: "استخدم مانكوزيب وأزل الأوراق المصابة", type: "fungal" },
  "Tomato___Spider_mites": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Spider Mites", problem_ar: "العناكب الحمراء", treatment_en: "Apply miticide or neem oil, increase humidity", treatment_ar: "استخدم مبيداً للعث أو زيت النيم وزد الرطوبة", type: "insect" },
  "Tomato___Target_Spot": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Target Spot", problem_ar: "البقعة الهدفية", treatment_en: "Apply azoxystrobin fungicide, improve air circulation", treatment_ar: "استخدم مبيداً فطرياً وحسّن التهوية", type: "fungal" },
  "Tomato___Yellow_Leaf_Curl_Virus": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Yellow Leaf Curl Virus", problem_ar: "فيروس تجعد الأوراق الصفراء", treatment_en: "Control whitefly, remove infected plants, use resistant varieties", treatment_ar: "تحكم في الذبابة البيضاء وأزل النباتات المصابة", type: "viral" },
  "Tomato___Mosaic_virus": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Tomato Mosaic Virus", problem_ar: "فيروس موزاييك الطماطم", treatment_en: "Remove infected plants, disinfect tools, use resistant varieties", treatment_ar: "أزل النباتات المصابة وعقّم الأدوات", type: "viral" },
  "Tomato___healthy": { plant_en: "Tomato", plant_ar: "طماطم", problem_en: "Healthy", problem_ar: "نبات سليم", treatment_en: "No treatment needed. Keep monitoring.", treatment_ar: "لا يحتاج علاجاً. استمر في المراقبة الدورية.", type: "healthy" },
};

// Tips حسب نوع المرض
function getTips(type) {
  const tipMap = {
    fungal: { en: ["Avoid excess humidity", "Remove infected leaves", "Apply fungicide regularly"], ar: ["تجنب الرطوبة الزائدة", "أزل الأوراق المصابة", "استخدم مبيداً فطرياً بانتظام"] },
    bacterial: { en: ["Use copper-based bactericide", "Avoid overhead watering", "Disinfect tools"], ar: ["استخدم مبيداً بكتيرياً نحاسياً", "تجنب الري بالرش", "عقّم الأدوات"] },
    insect: { en: ["Apply insecticide or neem oil", "Check plants daily", "Remove affected leaves"], ar: ["استخدم مبيد حشري أو زيت النيم", "افحص النباتات يومياً", "أزل الأوراق المتضررة"] },
    viral: { en: ["Remove infected plants", "Control insect vectors", "Use resistant varieties"], ar: ["أزل النباتات المصابة", "تحكم في الحشرات الناقلة", "استخدم أصناف مقاومة"] },
    healthy: { en: ["Continue regular monitoring", "Water appropriately", "Maintain soil health"], ar: ["استمر في المراقبة الدورية", "اسقِ بشكل مناسب", "حافظ على صحة التربة"] },
  };
  return tipMap[type] || tipMap.fungal;
}

// صوت خفيف
function sound() {
  if (!soundEnabled) return;
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  g.gain.value = 0.05;
  o.start(); o.stop(ctx.currentTime + 0.05);
}

// تحديث اللغة
function updateLanguage() {
  document.getElementById("appDesc").innerText = lang === "en" ? "Detect plant diseases and get treatment tips easily!" : "اكتشف أمراض النباتات واحصل على نصائح العلاج بسهولة!";
  document.getElementById("title").innerText = lang === "en" ? "Welcome 👋" : "مرحبًا 👋";
  document.getElementById("desc").innerText = lang === "en" ? "Upload a plant leaf image and we will help you detect diseases and suggest treatments easily." : "ارفع صورة ورقة النبات وسنساعدك في اكتشاف المرض واقتراح العلاج بسهولة";
  document.getElementById("start").innerText = lang === "en" ? "Start Diagnosis" : "ابدأ التشخيص";
  document.getElementById("uploadText").innerText = lang === "en" ? "Upload Image" : "ارفع صورة";
  document.getElementById("check").innerText = lang === "en" ? "Diagnose" : "تشخيص";

  if (lang === "ar") document.body.classList.add("rtl");
  else document.body.classList.remove("rtl");

  document.getElementById("colorTitle").innerText = lang === "en" ? "Color Guide" : "دليل الألوان";
  closePopup.innerText = lang === "en" ? "Close" : "إغلاق";

  const pTags = popup.querySelectorAll("p");
  pTags[0].innerText = lang === "en" ? "🔴 Fungal Infection" : "🔴 إصابة فطرية";
  pTags[1].innerText = lang === "en" ? "🟡 Nutrient Deficiency" : "🟡 نقص العناصر";
  pTags[2].innerText = lang === "en" ? "🟢 Insect Attack" : "🟢 هجوم حشرات";
}

// Intro Continue
continueBtn.addEventListener("click", () => {
  sound();
  intro.classList.add("hidden");
  welcome.classList.remove("hidden");
});

// Start Welcome
start.addEventListener("click", () => {
  sound();
  welcome.classList.add("hidden");
  diagnosis.classList.remove("hidden");
});

// عرض الصورة
imgInput.addEventListener("change", () => {
  preview.src = URL.createObjectURL(imgInput.files[0]);
  preview.style.display = "block";
});

// تشخيص — يرسل الصورة للسيرفر ويعرض نتيجة الموديل
check.addEventListener("click", async () => {
  sound();
  if (!imgInput.files[0]) { alert(lang === "en" ? "Upload image" : "ارفع صورة"); return; }

  result.innerHTML = `<div class="result-card"><p>⏳ ${lang === "en" ? "Analyzing image.." : "جاري تحليل الصورة.."}}</p></div>`;

  const formData = new FormData();
  formData.append('file', imgInput.files[0]);

  try {
    const response = await fetch('/predict', { method: 'POST', body: formData });
    const data = await response.json();

    if (data.error) {
      result.innerHTML = `<div class="result-card"><p>❌ ${data.error}</p></div>`;
      return;
    }

    const info = diseaseData[data.class_name];
    if (!info) {
      result.innerHTML = `<div class="result-card"><p>❌ ${lang === "en" ? "Unknown class: " + data.class_name : "كلاس غير معروف: " + data.class_name}</p></div>`;
      return;
    }

    document.body.classList.remove("bg-fungal", "bg-nutrient", "bg-insect");
    if (info.type === "fungal") document.body.classList.add("bg-fungal");
    if (info.type === "insect") document.body.classList.add("bg-insect");
    if (info.type === "healthy") document.body.classList.add("bg-nutrient");

    let tipsHTML = "";
    if (tipsEnabled) {
      const tips = getTips(info.type);
      const tipsArr = lang === "en" ? tips.en : tips.ar;
      tipsHTML = tipsArr.map(t => `<li>${t}</li>`).join("");
    }

    result.innerHTML = `
    <div class="result-card">
      <h3>🌿 ${lang === "en" ? info.plant_en : info.plant_ar}</h3>
      <p><b>${lang === "en" ? "Problem" : "المشكلة"}:</b> ${lang === "en" ? info.problem_en : info.problem_ar}</p>
      <p><b>${lang === "en" ? "Confidence" : "الثقة"}:</b> ${data.confidence}%</p>
      <p><b>${lang === "en" ? "Treatment" : "العلاج"}:</b> ${lang === "en" ? info.treatment_en : info.treatment_ar}</p>
      ${tipsEnabled ? `<div class="tips"><h4>💡 ${lang === "en" ? "Tips" : "نصائح"}:</h4><ul>${tipsHTML}</ul></div>` : ""}
    </div>`;

  } catch (err) {
    result.innerHTML = `<div class="result-card"><p>❌ ${lang === "en" ? "Connection error. Make sure the server is running (python app.py)" : "خطأ في الاتصال. تأكد من تشغيل السيرفر (python app.py)"}</p></div>`;
  }
});

// Settings Panel
settingsBtn.addEventListener("click", () => { settingsPanel.classList.toggle("hidden"); });
darkToggle.addEventListener("change", () => { document.body.classList.toggle("dark", darkToggle.checked); localStorage.setItem("theme", darkToggle.checked ? "dark" : "light"); });
langSelect.addEventListener("change", () => { lang = langSelect.value; localStorage.setItem("lang", lang); updateLanguage(); });
soundToggle.addEventListener("change", () => { soundEnabled = soundToggle.checked; localStorage.setItem("sound", soundEnabled ? "on" : "off"); });
tipsToggle.addEventListener("change", () => { tipsEnabled = tipsToggle.checked; localStorage.setItem("tips", tipsEnabled ? "on" : "off"); });

// Popup
infoBtn.addEventListener("click", () => { popup.classList.remove("hidden"); });
closePopup.addEventListener("click", () => { popup.classList.add("hidden"); });

// Load Settings
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") { document.body.classList.add("dark"); darkToggle.checked = true; }
  const savedLang = localStorage.getItem("lang");
  if (savedLang) { lang = savedLang; langSelect.value = savedLang; }
  const savedSound = localStorage.getItem("sound");
  if (savedSound) { soundEnabled = savedSound === "on"; soundToggle.checked = soundEnabled; }
  const savedTips = localStorage.getItem("tips");
  if (savedTips) { tipsEnabled = savedTips === "on"; tipsToggle.checked = tipsEnabled; }
  updateLanguage();
};