from bs4 import BeautifulSoup
import requests
from json import dumps
from processSetPages import findSet

def find_mats(link):
    data = requests.get(f"https://valheim.fandom.com{link}").content
    soup = BeautifulSoup(data, features="html.parser")
    try:
        name = soup.title.string.split(" |")[0]
    except:
        return

    divs = list(str(x) for x in soup.find_all("div", class_="pi-item pi-data pi-item-spacing pi-border-color"))

    index = 0
    for x in divs:
        if "Crafting Materials" in x:
            break
        index += 1

    try:
        correctDiv = divs[index]
    except:
        return

    lis = BeautifulSoup(correctDiv, features="html.parser").find_all("li")

    mats = []
    amnts = []
    for li in lis:
        mat = li.a.text
        try:
            amnt = "".join(li.text.split(mat)[1].split("x")[1]).strip()
        except:
            amnt = "".join(li.text.split(mat)[0].split("x")).strip()
        mats.append(mat)
        amnts.append(amnt)
    zipped = zip(mats, amnts)
    amounts = {mat: amnt for mat, amnt in zipped}
        
    return amounts, name

def find_all_pages(page, cat):
    data = requests.get(f"https://valheim.fandom.com{page}").content
    soup = BeautifulSoup(data, features="html.parser")

    div = soup.find("div", class_="category-page__members")
    if div is None:
        return [], cat
    atagsUnfiltered = div.find_all("a")
    atags = [tag for tag in atagsUnfiltered if "Category:" not in tag.get("href", "") if "set" not in str(tag.get("href", "")).lower() and "armor" not in str(tag.get("href", "")).lower()]
    sets = [tag for tag in atagsUnfiltered if "set" in str(tag.get("href", "")).lower() or "armor" in str(tag.get("href", "")).lower()]
    links = [tag.get("href") for tag in atags if tag.get("href")]
    setLinks = [tag.get("href") for tag in sets if tag.get("href")]
    
    return links, cat, setLinks

def process(links, cat, setLinks):
    data = {}
    for link in links:
        try:
            amounts, name = find_mats(link)
            if amounts != {}:
                data[name] = amounts
        except:
            try:
                print(find_mats(link))
            except:
                continue
    for setLink in setLinks:
        data.update(findSet(setLink))
    json_data = dumps(data, indent=2)
    with open(f"{cat}.json", "w") as f:
        f.write(json_data)
    


process(*find_all_pages("/wiki/Category:Armor", "armour"))

        