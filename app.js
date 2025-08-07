const app = document.getElementById("app");
const langSelect = document.getElementById("langSelect");
const themeSelect = document.getElementById("themeSelect");

const texts = {
  en: {
    title: "💰 My Savings",
    goalName: "Goal name:",
    goalAmount: "Goal amount:",
    addGoal: "Add Goal",
    income: "Add Income",
    expense: "Add Expense",
    history: "History",
    uploadImg: "Upload image",
    currency: "$"
  },
  ru: {
    title: "💰 Мои накопления",
    goalName: "Название цели:",
    goalAmount: "Сумма цели:",
    addGoal: "Добавить цель",
    income: "Добавить доход",
    expense: "Добавить расход",
    history: "История",
    uploadImg: "Загрузить изображение",
    currency: "₽"
  }
};

let lang = localStorage.getItem("lang") || "en";
let theme = localStorage.getItem("theme") || "pastel";
let goals = JSON.parse(localStorage.getItem("goals") || "[]");

langSelect.value = lang;
themeSelect.value = theme;
document.body.className = theme;

langSelect.onchange = () => {
  lang = langSelect.value;
  localStorage.setItem("lang", lang);
  render();
};

themeSelect.onchange = () => {
  theme = themeSelect.value;
  localStorage.setItem("theme", theme);
  document.body.className = theme;
};

function render() {
  const t = texts[lang];
  app.innerHTML = `<div class="container">
    <h1>${t.title}</h1>
    <input type="text" id="goalName" placeholder="${t.goalName}" />
    <input type="number" id="goalAmount" placeholder="${t.goalAmount}" />
    <input type="file" id="goalImg" accept="image/*" />
    <button onclick="addGoal()">${t.addGoal}</button>
    ${goals.map((g, i) => `
      <div class="card">
        <h3>${g.name}</h3>
        <img src="${g.img}" />
        <p>${g.balance}${t.currency} / ${g.amount}${t.currency}</p>
        <input type="number" id="inc${i}" placeholder="+ / - ${t.currency}" />
        <button onclick="changeBalance(${i}, true)">${t.income}</button>
        <button onclick="changeBalance(${i}, false)">${t.expense}</button>
        <button onclick="toggleHistory(${i})">${t.history}</button>
        <div id="hist${i}" style="display:none;">
          <ul>
            ${g.history.map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      </div>
    `).join("")}
  </div>`;
}

function addGoal() {
  const name = document.getElementById("goalName").value;
  const amount = document.getElementById("goalAmount").value;
  const file = document.getElementById("goalImg").files[0];

  if (!name || !amount || !file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    goals.push({
      name,
      amount: parseFloat(amount),
      balance: 0,
      img: e.target.result,
      history: []
    });
    localStorage.setItem("goals", JSON.stringify(goals));
    render();
  };
  reader.readAsDataURL(file);
}

function changeBalance(i, isIncome) {
  const input = document.getElementById("inc" + i);
  const val = parseFloat(input.value);
  if (isNaN(val)) return;
  goals[i].balance += isIncome ? val : -val;
  const sign = isIncome ? "+" : "-";
  goals[i].history.unshift(`${sign}${val} on ${new Date().toLocaleDateString()}`);
  localStorage.setItem("goals", JSON.stringify(goals));
  render();
}

function toggleHistory(i) {
  const el = document.getElementById("hist" + i);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

render();
