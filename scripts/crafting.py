import json

from playwright.sync_api import sync_playwright

URL = "https://valheimcheats.com/recipe"

recipes = []


def station(workbench: str) -> dict:
    if workbench.split()[-1].isdigit():
        name = " ".join(workbench.split()[:-1])
        level = int(workbench.split()[-1])
    else:
        name = workbench
        level = 1
    return {"name": name, "level": level}


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL, wait_until="networkidle")

    while True:
        # Wait to load
        page.locator("article").first.wait_for()

        # Get all recipes on current page
        cards = page.locator("article").all()

        for card in cards:
            recipe = card.evaluate("""el => {
                const name = el.querySelector('a[href^="/recipe/"]');
                const station = el.querySelector('[data-slot="badge"]');
                const ingredients = el.querySelector(
                    'div.mt-3.text-sm.leading-5'
                );
                const id = el.querySelector('code');
                const output = [...el.querySelectorAll('span')]
                    .map(s => s.innerText.trim())
                    .find(t => t.startsWith('Output '));

                return {
                    name: name?.innerText.trim() ?? '',
                    url: name?.getAttribute('href') ?? '',
                    station: station?.innerText.trim() ?? '',
                    ingredients: ingredients?.innerText.trim() ?? '',
                    item_id: id?.innerText.trim() ?? '',
                    output: output ?? ''
                };
            }""")

            recipes.append(recipe)

        next_button = page.get_by_role(
            "button", name="Go to next page"
        )

        if next_button.is_disabled():
            break

        # Remember the first recipe to detect when the page changes
        first_recipe = page.locator(
            'article a[href^="/recipe/"]'
        ).first
        previous_name = first_recipe.inner_text()

        next_button.click()

        page.wait_for_function(
            """previousName => {
                const first = document.querySelector(
                    'article a[href^="/recipe/"]'
                );
                return first && first.innerText.trim() !== previousName;
            }""",
            arg=previous_name
        )

    browser.close()

recipesdict = {r["name"]: {
    "ingredients": {i: int(n) for n, i in [x.split("\u00d7 ") for x in r["ingredients"].split(", ")]},
    # we need to do something a little different here, as workbenches can have multiple words and no level.
    "station": station(r["station"]),
    "output": r["output"].split("\u00d7")[1]
}
    for r in recipes}


with open("data/crafting.json", "w") as f:
    json.dump(recipesdict, f, indent=2)
