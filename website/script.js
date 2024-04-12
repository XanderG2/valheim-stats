const main = document.getElementById("main");
const resultsDiv = document.getElementById("results");
const resultsRecipeDiv = document.getElementById("resultsRecipes");
const buttonsDiv = document.getElementById("buttons");
const navbar = document.getElementById("navbar");
let total = Object.create(null);
let recipeAmounts = Object.create(null);
let completed = [];
let uncompleted = [];

function mainPage() {
  const options = [
    "all",
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
  searchbar.placeholder = "Search for recipe...";
  select = document.createElement("select");
  select.id = "select";
  select.setAttribute("onchange", "openRecipesPrep()");
  for (const optionText of options) {
    const option = document.createElement("option");
    option.textContent = optionText;
    option.value = optionText;
    select.appendChild(option);
  }
  homeButton = document.createElement("button");
  homeButton.textContent = "🏠";
  homeButton.style.float = "right";
  homeButton.onclick = () => {window.location.href = "https://xander.thegillams.co.uk"};
  navbar.appendChild(select);
  navbar.appendChild(searchbar);
  navbar.appendChild(homeButton);
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
    const expand = document.createElement("div");
    for (const [ingredient, amount] of Object.entries(ingredients)) {
      const br = document.createElement("br");
      const text1 = document.createElement("span");
      text1.textContent = ingredient;
      text1.id = "ingredient";
      const text2 = document.createElement("span");
      text2.textContent = amount;
      text2.id = "amount";
      const text = document.createTextNode(": ");
      expand.appendChild(br);
      expand.appendChild(text1);
      expand.appendChild(text);
      expand.appendChild(text2);
    }
    expand.id = "expand";
    expand.style.display = "none";
    const expandButton = document.createElement("button");
    expandButton.textContent = "↓";
    expandButton.onclick = () => {
      if (expand.style.display != "") {
        expand.style.display = "";
      } else {
        expand.style.display = "none";
      }
    };
    subdiv.appendChild(text);
    subdiv.appendChild(minusButton);
    subdiv.appendChild(amountTextP);
    subdiv.appendChild(addButton);
    subdiv.appendChild(expandButton);
    subdiv.appendChild(expand);
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
  const uncompletedDiv = document.createElement("div");
  uncompletedDiv.id = "uncompleted";
  const label2 = document.createElement("h1");
  label2.textContent = "Uncompleted";
  uncompletedDiv.appendChild(label2);
  const completedDiv = document.createElement("div");
  completedDiv.id = "completed";
  const label1 = document.createElement("h1");
  label1.textContent = "Completed";
  completedDiv.appendChild(label1);
  resultsDiv.appendChild(uncompletedDiv);
  resultsDiv.appendChild(completedDiv);
  //resultsRecipeDiv.innerHTML = "";
  //let totalHTML2 = document.createElement("div");
  for (const [ingredient, amount] of Object.entries(total)) {
    const div3 = document.createElement("div");
    const br = document.createElement("br");
    const text1 = document.createElement("span");
    text1.textContent = ingredient;
    text1.id = "ingredient";
    const text2 = document.createElement("span");
    text2.textContent = amount;
    text2.id = "amount";
    const text = document.createTextNode(": ");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    div3.appendChild(text1);
    div3.appendChild(text);
    div3.appendChild(text2);
    div3.appendChild(checkbox);
    div3.appendChild(br);
    div3.className = "noNewLine";
    uncompletedDiv.appendChild(div3);
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
  //resultsRecipeDiv.appendChild(totalHTML2);
  Array.from(document.getElementsByClassName("checkbox")).forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
      const ingredient = e.target.parentElement.querySelector("#ingredient").textContent
      if (e.target.checked) {
        if (uncompleted.includes(ingredient)) {
          uncompleted.splice(uncompleted.indexOf(ingredient));
        }
        completed.push(ingredient);
        completedDiv.appendChild(e.target.parentElement);
      } else {
        if (completed.includes(ingredient)) {
          completed.splice(completed.indexOf(ingredient));
        }
        uncompleted.push(ingredient);
        uncompletedDiv.appendChild(e.target.parentElement);
      }
    });
  });
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