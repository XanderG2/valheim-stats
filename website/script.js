const main = document.getElementById("main");
const resultsDiv = document.getElementById("results");
const buttonsDiv = document.getElementById("buttons");
const navbar = document.getElementById("navbar");
let total = Object.create(null);

function mainPage() {
  const options = [
    "armour",
    "building",
    "crafting",
    "food",
    "furniture",
    "materials",
    "misc",
    "tools",
    "weapons",
  ];
  select = document.createElement("select");
  select.id = "select"
  select.setAttribute("onchange", "openRecipesPrep()")
  for (const optionText of options) {
    const option = document.createElement("option");
    option.textContent = optionText;
    option.value = optionText;
    select.appendChild(option);
  }
  navbar.appendChild(select);
}

function openRecipesPrep() {
  openRecipes(document.getElementById("select").value)
}

async function openRecipes(JSONFile) {
  const response = await fetch(`../data/${JSONFile}.json`);
  const data = await response.json();
  buttonsDiv.innerHTML = "";
  for (const [recipe, ingredients] of Object.entries(data)) {
    const subdiv = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = recipe;
    button.className = "noMP";
    button.onclick = () => {
      addRecipe(ingredients);
    };
    const p = document.createElement("p");
    let string = "";
    string = string.substring(0, string.length - 2);
    const text = document.createTextNode(string);
    p.appendChild(text);
    p.className = "noMP";
    subdiv.appendChild(button);
    subdiv.appendChild(p);
    subdiv.className = "noMP f";
    buttonsDiv.appendChild(subdiv);
  }
}

function addRecipe(ingredients) {
  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = parseInt(amount, 10);
    if (total[ingredient]) {
      total[ingredient] = total[ingredient] + n;
    } else {
      total[ingredient] = n;
    }
  }
  view()
}

function view() {
  resultsDiv.innerHTML = "";
  let totalHTML = document.createElement("div");
  for (const [ingredient, amount] of Object.entries(total)) {
    const br = document.createElement("br");
    const text = document.createTextNode(`${ingredient}: ${amount}`);
    const div3 = document.createElement("div");
    div3.appendChild(br);
    div3.appendChild(text);
    div3.className = "noNewLine";
    totalHTML.appendChild(div3);
  }
  resultsDiv.appendChild(totalHTML);
}

mainPage();
openRecipesPrep();