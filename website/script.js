const main = document.getElementById("main");
const resultsDiv = document.getElementById("results");
const resultsRecipeDiv = document.getElementById("resultsRecipes");
const buttonsDiv = document.getElementById("buttons");
const navbar = document.getElementById("navbar");
let total = Object.create(null);
let recipeAmounts = Object.create(null);

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
  searchbar = document.createElement("input");
  searchbar.type = "search";
  searchbar.id = "search";
  select = document.createElement("select");
  select.id = "select";
  select.setAttribute("onchange", "openRecipesPrep()");
  for (const optionText of options) {
    const option = document.createElement("option");
    option.textContent = optionText;
    option.value = optionText;
    select.appendChild(option);
  }
  navbar.appendChild(select);
  navbar.appendChild(searchbar);
}

function openRecipesPrep() {
  openRecipes(document.getElementById("select").value);
}

async function openRecipes(JSONFile) {
  const response = await fetch(`../data/${JSONFile}.json`);
  const data = await response.json();
  buttonsDiv.innerHTML = "";
  for (const [recipe, ingredients] of Object.entries(data)) {
    const subdiv = document.createElement("div");
    const text = document.createElement("p");
    text.textContent = recipe;
    text.className = "noMP";
    text.id = "text";
    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.onclick = () => {
      addRecipe(ingredients, recipe);
    };
    const minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.onclick = () => {
      takeRecipe(ingredients, recipe);
    };
    const amountTextP = document.createElement("p");
    if (recipeAmounts[recipe] > 0) {
      amountTextP.textContent = String(recipeAmounts[recipe]);
    } else {
      amountTextP.textContent = "0";
    }
    amountTextP.className = "amountP";
    subdiv.appendChild(text);
    subdiv.appendChild(minusButton);
    subdiv.appendChild(amountTextP);
    subdiv.appendChild(addButton);
    subdiv.className = "noMP f searchElement buttonContainer";
    buttonsDiv.appendChild(subdiv);
  }
}

function addRecipe(ingredients, recipe) {
  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = parseInt(amount, 10);
    if (total[ingredient]) {
      total[ingredient] = total[ingredient] + n;
    } else {
      total[ingredient] = n;
    }
  }
  if (recipeAmounts[recipe]) {
    recipeAmounts[recipe] += 1;
  } else {
    recipeAmounts[recipe] = 1;
  }
  view();
  openRecipesPrep();
}

function takeRecipe(ingredients, recipe) {
  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = parseInt(amount, 10);
    if (recipeAmounts[recipe] > 0) {
      total[ingredient] = total[ingredient] - n;
    } else {
      return;
    }
    if (total[ingredient] <= 0) {
      delete total[ingredient];
    }
  }
  recipeAmounts[recipe] -= 1;
  if (recipeAmounts[recipe] <= 0) {
    delete recipeAmounts[recipe];
  }
  view();
  openRecipesPrep();
}

function view() {
  resultsDiv.innerHTML = "";
  resultsRecipeDiv.innerHTML = "";
  let totalHTML = document.createElement("div");
  //let totalHTML2 = document.createElement("div");
  for (const [ingredient, amount] of Object.entries(total)) {
    const br = document.createElement("br");
    const text = document.createTextNode(`${ingredient}: ${amount}`);
    const div3 = document.createElement("div");
    div3.appendChild(text);
    div3.appendChild(br);
    div3.className = "noNewLine";
    totalHTML.appendChild(div3);
  }
  //Display total on the right instead of next to
  /*for (const [recipe, amount] of Object.entries(recipeAmounts)) {
    console.log(recipeAmounts)
    const br2 = document.createElement("br");
    const text2 = document.createTextNode(`${recipe}: ${amount}`);
    const div4 = document.createElement("div");
    div4.appendChild(text2);
    div4.appendChild(br2);
    div4.className = "noNewLine";
    totalHTML2.appendChild(div4);
  }*/
  resultsDiv.appendChild(totalHTML);
  //resultsRecipeDiv.appendChild(totalHTML2);
}

mainPage();
openRecipesPrep();
document.getElementById("search").addEventListener("input", (e) => {
  const value = e.target.value;
  const filter = value.toUpperCase();
  const elements = document.getElementsByClassName("searchElement");
  for (i = 0; i < elements.length; i++) {
    var p = elements[i].querySelector('p');
    if (p) {
      txtValue = p.textContent || p.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          elements[i].style.display = "";
      } else {
          elements[i].style.display = "none";
      }
    }
  }
})