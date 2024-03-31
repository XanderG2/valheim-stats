// @ts-check
const div2 = document.getElementById("buttons");
if (!div2) throw new Error("Couldn't find buttons");
const div = div2;
/** @type {Record<string, number>} */
let total = Object.create(null);

function mainPage() {
  const viewButton = document.createElement("button");
  viewButton.textContent = "See Total";
  viewButton.onclick = function () {
    view();
  };
  div.appendChild(viewButton);
  const buttons = [
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
  for (const buttonText of buttons) {
    const button = document.createElement("button");
    button.textContent = buttonText;
    button.onclick = function () {
      openRecipes(buttonText);
    };
    div.appendChild(button);
  }
}

async function openRecipes(JSONFile) {
  const response = await fetch(`../data/${JSONFile}.json`);
  /** @type {Record<string, Record<string, string>>} */
  const data = await response.json();
  div.innerHTML = "";
  const returnButton = document.createElement("button");
  returnButton.textContent = "Return";
  returnButton.onclick = () => {
    div.innerHTML = "";
    mainPage();
  };
  div.appendChild(returnButton);
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
    for (const [ingredient, amount] of Object.entries(ingredients)) {
      string += `${ingredient} x${amount}, `;
    }
    string = string.substring(0, string.length - 2);
    const text = document.createTextNode(string);
    p.appendChild(text);
    p.className = "noMP";
    subdiv.appendChild(button);
    subdiv.appendChild(p);
    subdiv.className = "noMP f";
    div.appendChild(subdiv);
  }
}

/** @param ingredients {Record<string, string>} */
function addRecipe(ingredients) {
  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = parseInt(amount, 10);
    if (total[ingredient]) {
      total[ingredient] = total[ingredient] + n;
    } else {
      total[ingredient] = n;
    }
  }
}

function view() {
  div.innerHTML = "";
  const returnButton = document.createElement("button");
  returnButton.textContent = "Return";
  returnButton.onclick = () => {
    div.innerHTML = "";
    mainPage();
  };
  div.appendChild(returnButton);
  let totalHTML = document.createElement("div");
  for (const [ingredient, amount] of Object.entries(total)) {
    const br = document.createElement("br");
    const text = document.createTextNode(`${ingredient}: ${amount}`);
    const div3 = document.createElement("div");
    div3.appendChild(br);
    div3.appendChild(text);
    div3.style.display = "inline";
    totalHTML.appendChild(div3);
  }
  div.appendChild(totalHTML);
}

mainPage();
