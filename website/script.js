const main = document.getElementById("main");
const resultsDiv = document.getElementById("results");
const buttonsDiv = document.getElementById("buttons");
const navbar = document.getElementById("navbar");

let total = Object.create(null);
let recipeAmounts = Object.create(null);
let completed = [];
let uncompleted = [];
let craftingData = Object.create(null);

function firstLoad() {
  load();
  mainPage();
}

function save() {
  localStorage.setItem("total", JSON.stringify(total));
  localStorage.setItem("recipeAmounts", JSON.stringify(recipeAmounts));
  localStorage.setItem("completed", JSON.stringify(completed));
  localStorage.setItem("uncompleted", JSON.stringify(uncompleted));
}

function load() {
  try {
    total = JSON.parse(localStorage.getItem("total")) ?? Object.create(null);
    recipeAmounts = JSON.parse(localStorage.getItem("recipeAmounts")) ?? Object.create(null);
    completed = JSON.parse(localStorage.getItem("completed")) ?? [];
    uncompleted = JSON.parse(localStorage.getItem("uncompleted")) ?? [];
  } catch (error) {
    console.warn("Could not load saved calculator data:", error);
    total = Object.create(null);
    recipeAmounts = Object.create(null);
    completed = [];
    uncompleted = [];
  }
}

function mainPage() {
  addNav();
  openRecipesPrep();
  view();
}

function addNav() {
  const searchbar = document.createElement("input");
  searchbar.type = "search";
  searchbar.id = "search";
  searchbar.placeholder = "Search for recipe or ingredient...";
  searchbar.addEventListener("input", () => search(searchbar));

  const select = document.createElement("select");
  select.id = "select";

  const option = document.createElement("option");
  option.textContent = "crafting";
  option.value = "crafting";
  select.appendChild(option);
  select.addEventListener("change", openRecipesPrep);

  const attribution = document.createElement("p");
  attribution.textContent = "By Xander";
  attribution.style.float = "right";
  attribution.style.margin = "0";

  const homeButton = document.createElement("button");
  homeButton.textContent = "🏠";
  homeButton.style.float = "right";
  homeButton.onclick = () => {
    window.location.href = "https://xander.thegillams.co.uk";
  };

  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear all";
  clearButton.id = "clearButton";
  clearButton.onclick = clear;

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save all";
  saveButton.id = "saveButton";
  saveButton.onclick = save;

  navbar.replaceChildren(select, searchbar, clearButton, saveButton, homeButton, attribution);
}

function openRecipesPrep() {
  const select = document.getElementById("select");
  if (select) openRecipes(select.value);
}

function el(tagName, attributes = {}) {
  const element = document.createElement(tagName);

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "style") {
      Object.assign(element.style, value);
    } else {
      element[key] = value;
    }
  }

  return element;
}

async function openRecipes(JSONFile) {
  try {
    const response = await fetch(`../data/${JSONFile}.json`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while loading ${JSONFile}.json`);
    }

    const data = await response.json();
    craftingData = data;
    buttonsDiv.replaceChildren();

    for (const [recipe, details] of Object.entries(data)) {
      const ingredients = details.ingredients ?? {};
      const station = details.station ?? {};
      const output = Number(details.output) || 1;

      const subdiv = el("div", {
        style: {
          display: "flex",
          flexDirection: "column",
        },
      });

      const row = el("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        },
      });

      const recipeName = el("p", {
        textContent: recipe,
        className: "noMP recipeName",
      });

      recipeName.style.flex = "1";

      const minusButton = document.createElement("button");
      minusButton.textContent = "-";
      minusButton.setAttribute("aria-label", `Remove one batch of ${recipe}`);
      minusButton.onclick = () => takeRecipe(ingredients, recipe);

      const amountText = el("p", {
        textContent: String(recipeAmounts[recipe] ?? 0),
        className: "amountP",
      });

      const addButton = document.createElement("button");
      addButton.textContent = "+";
      addButton.setAttribute("aria-label", `Add one batch of ${recipe}`);
      addButton.onclick = () => addRecipe(ingredients, recipe);

      const expand = document.createElement("div");
      expand.id = "expand";
      expand.style.display = "none";
      expand.style.marginBottom = "1em";

      const stationText = document.createElement("p");
      const stationName = station.name || "Unknown station";
      const stationLevel = station.level;

      stationText.textContent =
        stationLevel == null ? `Station: ${stationName}` : `Station: ${stationName} (level ${stationLevel})`;

      expand.appendChild(stationText);

      const outputText = document.createElement("p");
      outputText.textContent = `This recipe makes ${output}.`;
      expand.appendChild(outputText);

      for (const [ingredient, amount] of Object.entries(ingredients)) {
        const ingredientLine = document.createElement("div");

        const ingredientName = el("span", {
          textContent: ingredient,
          id: "ingredient",
        });

        const ingredientAmount = el("span", {
          textContent: String(amount),
          id: "amount",
        });

        ingredientLine.append(ingredientName, document.createTextNode(": "), ingredientAmount);

        expand.appendChild(ingredientLine);
      }

      const expandButton = document.createElement("button");

      const img = document.createElement("img");
      img.src = "down.svg";
      img.alt = "Show recipe details";

      expandButton.appendChild(img);
      expandButton.setAttribute("aria-expanded", "false");

      expandButton.onclick = () => {
        const isHidden = expand.style.display === "none";

        expand.style.display = isHidden ? "" : "none";
        img.src = isHidden ? "up.svg" : "down.svg";
        img.alt = isHidden ? "Hide recipe details" : "Show recipe details";

        expandButton.setAttribute("aria-expanded", String(isHidden));
      };

      row.append(recipeName, minusButton, amountText, addButton, expandButton);

      subdiv.append(row, expand);
      subdiv.className = "noMP f searchElement buttonContainer";

      buttonsDiv.appendChild(subdiv);
    }

    search(document.getElementById("search"));
  } catch (error) {
    console.error("couldnt load crafting recipes:", error);

    buttonsDiv.textContent = "couldnt load crafting recipes... check that ../data/crafting.json exists";
  }
}

function addRecipe(ingredients, recipe) {
  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = Number(amount) || 0;

    if (n === 0) continue;

    total[ingredient] = (Number(total[ingredient]) || 0) + n;
  }

  recipeAmounts[recipe] = (Number(recipeAmounts[recipe]) || 0) + 1;

  save();
  view();
  openRecipesPrep();
}

function takeRecipe(ingredients, recipe) {
  if (!(recipeAmounts[recipe] > 0)) return;

  for (const [ingredient, amount] of Object.entries(ingredients)) {
    const n = Number(amount) || 0;

    if (n === 0) continue;

    total[ingredient] = (Number(total[ingredient]) || 0) - n;

    if (total[ingredient] <= 0) {
      delete total[ingredient];
    }
  }

  recipeAmounts[recipe] -= 1;

  if (recipeAmounts[recipe] <= 0) {
    delete recipeAmounts[recipe];
  }

  completed = completed.filter((ingredient) => ingredient in total);

  uncompleted = uncompleted.filter((ingredient) => ingredient in total);

  save();
  view();
  openRecipesPrep();
}

function view() {
  resultsDiv.replaceChildren();

  const uncompletedDiv = document.createElement("div");
  uncompletedDiv.id = "uncompleted";

  uncompletedDiv.appendChild(el("h1", { textContent: "Uncompleted" }));

  const completedDiv = document.createElement("div");
  completedDiv.id = "completed";

  completedDiv.appendChild(el("h1", { textContent: "Completed" }));

  resultsDiv.append(uncompletedDiv, completedDiv);

  for (const [ingredient, amount] of Object.entries(total)) {
    const item = document.createElement("div");

    const name = el("span", {
      textContent: ingredient,
      id: "ingredient",
    });

    const quantity = el("span", {
      textContent: String(amount),
      id: "amount",
    });

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = completed.includes(ingredient);

    item.append(name, document.createTextNode(": "), quantity, checkbox, document.createElement("br"));

    item.className = "noNewLine";

    if (checkbox.checked) {
      completedDiv.appendChild(item);
    } else {
      uncompletedDiv.appendChild(item);
    }

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        completed = [...new Set([...completed, ingredient])];

        uncompleted = uncompleted.filter((itemName) => itemName !== ingredient);
      } else {
        uncompleted = [...new Set([...uncompleted, ingredient])];

        completed = completed.filter((itemName) => itemName !== ingredient);
      }

      save();
      view();
    });
  }
}

function mkre(text) {
  const cleanText = text.toLowerCase().replace(/[^a-z0-9]/g, "");

  const re = cleanText.split("").join(".*");

  return new RegExp(re, "i");
}

function search(target) {
  if (!target) return;

  const value = target.value.trim();
  const elements = document.getElementsByClassName("searchElement");
  const re = mkre(value);

  for (const element of elements) {
    const recipeName = element.querySelector(".recipeName");
    const ingredients = element.querySelectorAll("#ingredient");

    const matchesRecipe = re.test(recipeName?.textContent ?? "");

    const matchesIngredient = Array.from(ingredients).some((item) => re.test(item.textContent ?? ""));

    element.style.display = !value || matchesRecipe || matchesIngredient ? "" : "none";
  }
}

function clear() {
  total = Object.create(null);
  recipeAmounts = Object.create(null);
  completed = [];
  uncompleted = [];

  save();
  view();
  openRecipesPrep();
}

firstLoad();
