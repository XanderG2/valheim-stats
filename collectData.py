from bs4 import BeautifulSoup
from subprocess import check_output
from json import dumps

def find_mats(link):
    data = check_output(["curl", f"https://valheim.fandom.com{link}"])
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
        return {name: {"No crafting materials."}}

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
    data = check_output(["curl", f"https://valheim.fandom.com{page}"])
    soup = BeautifulSoup(data, features="html.parser")

    div = soup.find("div", class_="category-page__members")
    atagsUnfiltered = div.find_all("a")
    atags = [tag for tag in atagsUnfiltered if "Category:" not in tag.get("href", "")]
    links = [tag.get("href") for tag in atags if tag.get("href")]
    
    process(links, cat)

def process(links, cat):
    data = {}
    for link in links:
        try:
            amounts, name = find_mats(link)
            data[name] = amounts
        except:
            try:
                print(find_mats(link))
            except:
                continue
    json_data = dumps(data, indent=2)
    with open(f"{cat}.json", "w") as f:
        f.write(json_data)
    


find_all_pages("/wiki/Category:Capes", "capes")

        