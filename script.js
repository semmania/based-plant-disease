document.addEventListener('DOMContentLoaded', () => {
  // --- UI & NAVIGATION ---
  const pages = document.querySelectorAll('.page');
  const sidebarIcons = document.querySelectorAll('.sidebar-icon[data-page]');
  const dots = document.querySelectorAll('.dot[data-page]');
  
  // Login
  const loginBtn = document.getElementById('loginBtn');
  const loginScreen = document.getElementById('login');
  const mainApp = document.getElementById('mainApp');

  if(loginBtn) {
    loginBtn.addEventListener('click', () => {
      loginScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
    });
  }

  // Navigation function
  function showPage(pageId) {

    if(pageId === 'login') return;

    pages.forEach(p => {
      if(p.id !== 'login') p.classList.add('hidden');
    });
    
    const target = document.getElementById(pageId);
    if(target) target.classList.remove('hidden');

    // Update Sidebar active state
    sidebarIcons.forEach(icon => {
      icon.classList.toggle('active', icon.dataset.page === pageId);
    });

    dots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.page === pageId);
    });
  }

  sidebarIcons.forEach(icon => {
    icon.addEventListener('click', () => showPage(icon.dataset.page));
  });
  dots.forEach(dot => {
    dot.addEventListener('click', () => showPage(dot.dataset.page));
  });

  const continueBtn = document.getElementById('continueBtn');
  const startBtn = document.getElementById('start');

  if(continueBtn) continueBtn.addEventListener('click', () => showPage('welcome'));
  if(startBtn) startBtn.addEventListener('click', () => showPage('diagnosis'));


  window.goBack = function(pageId) {
    showPage(pageId);
  };

  // --- SETTINGS PANEL ---
  const settingsBtn = document.getElementById('sidebarSettingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const darkToggle = document.getElementById('darkToggle');

  if(settingsBtn && settingsPanel) {
    settingsBtn.addEventListener('click', () => {
      settingsPanel.classList.toggle('hidden');
    });
  }

  if(darkToggle) {
    darkToggle.addEventListener('change', (e) => {
      if(e.target.checked) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  }

  // --- DIAGNOSIS LOGIC (AI INTEGRATION) ---
  const imgInput = document.getElementById('imgInput');
  const preview = document.getElementById('preview');
  const checkBtn = document.getElementById('check');
  const resultDiv = document.getElementById('result');

  let selectedFile = null;

  if(imgInput) {
    imgInput.addEventListener('change', (e) => {
      selectedFile = e.target.files[0];
      if (selectedFile) {
        preview.src = URL.createObjectURL(selectedFile);
        preview.style.display = 'block';
        resultDiv.innerHTML = ''; // Clear previous results
      }
    });
  }

  if(checkBtn) {
    checkBtn.addEventListener('click', async () => {
      if (!selectedFile) {
        alert("Please upload an image first.");
        return;
      }

      checkBtn.innerText = "Analyzing...";
      checkBtn.disabled = true;
      resultDiv.innerHTML = '<div class="result-card"><p>⏳ Please wait, AI is analyzing your plant...</p></div>';

      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          resultDiv.innerHTML = `
            <div class="result-card">
              <h3 style="color:var(--primary-color); border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:20px;">
                نتائج الفحص الذكي 🔍
              </h3>
              
              <div style="background: rgba(42, 157, 143, 0.05); padding:15px; border-radius:12px; margin-bottom:15px;">
                <p><strong>المرض المكتشف:</strong> <span style="font-size:20px; color:#d62828;">${data.disease_ar}</span></p>
                <p style="font-size:13px; color:#666;">Scientific Name: ${data.disease_en}</p>
                <p><strong>نسبة التأكد:</strong> <span style="color:var(--primary-color); font-weight:bold;">${data.confidence}%</span></p>
              </div>

              <div style="text-align:right; direction:rtl;">
                <p><strong>⚠️ مستوى الخطورة:</strong> 
                  <span style="padding:4px 10px; border-radius:20px; font-size:14px; background:${data.risk_level.includes('High') || data.risk_level.includes('Critical') || data.risk_level.includes('عالي') ? '#ffeded; color:#d62828;' : '#fff3cd; color:#856404;'}">
                    ${data.risk_level}
                  </span>
                </p>
                
                <div style="margin-top:20px;">
                  <h4 style="color:#1b4332;">🌱 الأسباب المحتملة:</h4>
                  <p style="background:#f8f9fa; padding:12px; border-radius:10px; line-height:1.6;">${data.causes}</p>
                </div>

                <div style="margin-top:20px;">
                  <h4 style="color:#1b4332;">💡 توصيات الخبير الزراعي:</h4>
                  <p style="background:#e8f3ee; padding:15px; border-radius:10px; border-right:4px solid var(--primary-color); line-height:1.8;">
                    ${data.recommendation}
                  </p>
                </div>
              </div>
              
              <button onclick="window.print()" style="margin-top:20px; background:#6c757d; font-size:14px; padding:10px;">طباعة التقرير / Print Report</button>
            </div>
          `;
        } else {
          resultDiv.innerHTML = `<div class="result-card" style="border-left-color:red"><p>❌ Error: ${data.error}</p></div>`;
        }
      } catch (error) {
        resultDiv.innerHTML = `<div class="result-card" style="border-left-color:red"><p>🔌 Cannot connect to server. Please ensure the Python server is running.</p></div>`;
        console.error(error);
      } finally {
        checkBtn.innerText = "Diagnose";
        checkBtn.disabled = false;
      }
    });
  }

  // --- WIDGET DATA & LOGIC ---

  // 1. Daily Tips
  const dailyTips = [
    { en: "Water your plants early in the morning to reduce evaporation.", ar: "اسقِ نباتاتك في الصباح الباكر لتقليل التبخر." },
    { en: "Use organic compost to improve soil health.", ar: "استخدم السماد العضوي لتحسين صحة التربة." },
    { en: "Check for pests under the leaves regularly.", ar: "افحص أوراق النبات بانتظام من الأسفل للتأكد من خلوها من الآفات." },
    { en: "Crop rotation helps prevent soil depletion.", ar: "الدورة الزراعية تساعد في منع استنزاف التربة." },
    { en: "Mulching helps retain moisture in the soil.", ar: "تغطية التربة (المالش) تساعد في الاحتفاظ بالرطوبة." }
  ];

  function updateDailyTip() {
    const tip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    const dailyTipText = document.getElementById('dailyTipText');
    if (dailyTipText) {
      dailyTipText.innerHTML = `${tip.en}<br><br>${tip.ar}`;
    }
  }

  // 2. Seasonal Calendar
  const seasonalCrops = {
    0: { name: "January / يناير", crops: ["جزر / carrot", "البسله / Peas", "Broad Beans / فول"," الخس / Lettuce"," جرجير / Watercress "] },
    1: { name: "February / فبراير", crops: ["Potatoes / بطاطس", "Tomatoes / طماطم", "Cabbage / كرنب"," فجل / Radish "] },
    2: { name: "March / مارس", crops: ["Cucumber / خيار", "Pepper / فلفل", "Eggplant / باذنجان"," ذره / Corn"] },
    3: { name: "April / أبريل", crops: ["Watermelon / بطيخ", "Corn / ذرة", "Okra / بامية","فول الصويا / Soybean"] },
    4: { name: "May / مايو", crops: ["Sweet Potato / بطاطا", "Zucchini / كوسة", "Beans / فاصوليا"," ارز / Rice"] },
    5: { name: "June / يونيو", crops: ["Melon / شمام", "Sunflower / عباد الشمس","Eggplant / باذنجان","Zucchini / كوسة"] },
    6: { name: "July / يوليو", crops: ["Maize / ذرة شامية", "Sorghum / ذرة رفيعة","اللوبيا / Cawpea"," السمسم / Sesame"] },
    7: { name: "August / أغسطس", crops: ["Cabbage (Early) / كرنب مبكر", "Carrots / جزر","Okra / بامية","ملوخيه / Molokhia"] },
    8: { name: "September / سبتمبر", crops: ["Spinach / سبانخ", "Lettuce / خس", "Radish / فجل"," بقدونس / Parsley"," كزبره / Goosebumps"] },
    9: { name: "October / أكتوبر", crops: ["Wheat / قمح", "Clover / برسيم", "Peas / بسلة"] },
    10: { name: "November / نوفمبر", crops: ["Broad Beans / فول بلدي", "Lentils / عدس"] },
    11: { name: "December / ديسمبر", crops: ["Strawberry / فراولة", "Artichoke / خرشوف"] }
  };

  function updateCalendar() {
    const now = new Date();
    const month = now.getMonth();
    const data = seasonalCrops[month];
    
    document.getElementById('currentMonthName').innerText = data.name;
    const list = document.getElementById('calendarList');
    if(list) {
      list.innerHTML = data.crops.map(crop => `
        <div class="card" style="padding:15px; border-left:4px solid var(--primary-color);">
          <strong>${crop}</strong>
        </div>
      `).join('');
    }
  }

  // 3. Encyclopedia
  const plantLibrary = [
    { name: "Tomato / طماطم", desc: "Needs full sun and consistent watering / تحتاج شمس كاملة وري منتظم" },
    { name: "Potato / بطاطس", desc: "Grows underground, needs loose soil / تنمو تحت الأرض، تحتاج تربة مفككة" },
    { name: "Pepper / فلفل", desc: "Requires warm temperatures / يحتاج درجات حرارة دافئة" },
    { name: "Cucumber / خيار", desc: "Vining plant, needs support / نبات متسلق، يحتاج دعامات" }
  ];

  function loadEncyclopedia() {
    const list = document.getElementById('encycList');
    if(list) {
      list.innerHTML = plantLibrary.map(p => `
        <div class="card">
          <h4>${p.name}</h4>
          <p style="font-size:14px; color:#666;">${p.desc}</p>
        </div>
      `).join('');
    }
  }

  // 4. Persistence (Notes, Garden, etc.)
  function setupPersistence(id, listId, inputId, storageKey) {
    const list = document.getElementById(listId);
    const btn = document.getElementById(id);
    const input = document.getElementById(inputId);

    const load = () => {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if(list) {
        list.innerHTML = items.map((item, idx) => `
          <div class="card" style="display:flex; justify-content:space-between; align-items:center; text-align:right; padding:15px; margin-bottom:10px;">
            <span>${item}</span>
            <button onclick="deletePersistentItem('${storageKey}', ${idx}, '${listId}')" style="width:auto; padding:5px 10px; background:#e63946; font-size:12px; margin:0;">X</button>
          </div>
        `).join('');
      }
    };

    window.deletePersistentItem = (key, idx, lId) => {
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      items.splice(idx, 1);
      localStorage.setItem(key, JSON.stringify(items));
      // Reload relevant list
      if(key === 'my_garden') setupPersistence('addVgBtn', 'vgList', 'vgName', 'my_garden');
      if(key === 'my_notes') setupPersistence('addNoteBtn', 'notesList', 'noteText', 'my_notes');
      if(key === 'my_favs') setupPersistence('addFavBtn', 'favList', 'favName', 'my_favs');
      if(key === 'my_reminders') setupReminders();
    };

    if(btn) {
      btn.onclick = () => {
        if(!input.value) return;
        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        items.push(input.value);
        localStorage.setItem(storageKey, JSON.stringify(items));
        input.value = '';
        load();
      };
    }
    load();
  }

  // 5. Specialized Reminders
  function setupReminders() {
    const list = document.getElementById('remindersList');
    const btn = document.getElementById('addRemBtn');
    const nameInput = document.getElementById('remName');
    const daysInput = document.getElementById('remDays');

    const load = () => {
      const items = JSON.parse(localStorage.getItem('my_reminders') || '[]');
      if(list) {
        list.innerHTML = items.map((item, idx) => `
          <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:10px; margin-bottom:5px;">
             <span>💧 ${item.name} - Every ${item.days} days / كل ${item.days} أيام</span>
             <button onclick="deletePersistentItem('my_reminders', ${idx}, 'remindersList')" style="width:auto; padding:2px 8px; background:#e63946; font-size:10px; margin:0;">X</button>
          </div>
        `).join('');
      }
    };

    if(btn) {
      btn.onclick = () => {
        if(!nameInput.value || !daysInput.value) return;
        const items = JSON.parse(localStorage.getItem('my_reminders') || '[]');
        items.push({ name: nameInput.value, days: daysInput.value });
        localStorage.setItem('my_reminders', JSON.stringify(items));
        nameInput.value = '';
        daysInput.value = '';
        load();
      };
    }
    load();
  }

  // 6. Weather Mock
  function loadWeather() {
    const weatherInfo = document.getElementById('weatherInfo');
    if(weatherInfo) {
      weatherInfo.innerHTML = `
        <div style="font-size:20px;">Cairo, Egypt / القاهرة</div>
        <div style="font-size:40px; margin:10px 0;">28°C ☀️</div>
        <div>Sunny / مشمس</div>
        <div style="font-size:12px; margin-top:10px;">Humidity: 45% / الرطوبة: ٤٥٪</div>
      `;
    }
  }

  // --- INITIALIZE ALL ---
  updateDailyTip();
  updateCalendar();
  loadEncyclopedia();
  loadWeather();
  setupPersistence('addVgBtn', 'vgList', 'vgName', 'my_garden');
  setupPersistence('addNoteBtn', 'notesList', 'noteText', 'my_notes');
  setupPersistence('addFavBtn', 'favList', 'favName', 'my_favs');
  setupReminders();

  // --- CALCULATOR LOGIC ---
  const calcBtn = document.getElementById('calcBtn');
  const calcArea = document.getElementById('calcArea');
  const calcCrop = document.getElementById('calcCrop');
  const calcResult = document.getElementById('calcResult');

  if(calcBtn) {
    calcBtn.addEventListener('click', () => {
      if(!calcArea.value) {
        calcResult.innerText = "Please enter area size / الرجاء إدخال المساحة";
        return;
      }
      const area = parseFloat(calcArea.value);
      const rate = parseFloat(calcCrop.value);
      const result = (area * rate).toFixed(2);
      calcResult.innerText = `You need ${result} kg of fertilizer / تحتاج ${result} كجم من السماد`;
    });
  }

  // --- LOGOUT LOGIC ---
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.getElementById('mainApp').classList.add('hidden');
      document.getElementById('login').classList.remove('hidden');
      const settingsPanel = document.getElementById('settingsPanel');
      if(settingsPanel) settingsPanel.classList.add('hidden');
    });
  }

  // --- CHATBOT LOGIC ---
  const chatIcon = document.getElementById('chatIcon');
  const chatWindow = document.getElementById('chatWindow');
  const closeChat = document.getElementById('closeChat');
  const sendChat = document.getElementById('sendChat');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');

  if(chatIcon && chatWindow && closeChat) {
    chatIcon.onclick = () => chatWindow.classList.toggle('hidden');
    closeChat.onclick = () => chatWindow.classList.add('hidden');
  }

  async function sendMessage() {
    const msg = chatInput.value.trim();
    if(!msg) return;

    // User message
    appendMessage('user', msg);
    chatInput.value = '';

    // Typing indicator
    const typingId = 'typing-' + Date.now();
    appendMessage('bot', '...', typingId);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await response.json();
      
      const typingEl = document.getElementById(typingId);
      if(typingEl) typingEl.remove();

      if(data.response) {
        appendMessage('bot', data.response);
      } else if (data.error) {
        appendMessage('bot', "خطأ من السيرفر: " + data.error);
      } else {
        appendMessage('bot', "عذراً، حدث خطأ غير معروف.");
      }
    } catch (err) {
      const typingEl = document.getElementById(typingId);
      if(typingEl) typingEl.remove();
      appendMessage('bot', "حدث خطأ في الاتصال بالسيرفر.");
    }
  }

  function appendMessage(sender, text, id = null) {
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    if(id) div.id = id;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  if(sendChat) sendChat.onclick = sendMessage;
  if(chatInput) {
    chatInput.onkeypress = (e) => {
      if(e.key === 'Enter') sendMessage();
    };
  }
});
