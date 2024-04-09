import requests
from bs4 import BeautifulSoup

def findSet(link):
    if link[0] == "/":
        link = "https://valheim.fandom.com" + link
    armorDict = {}
    response = requests.get(link)
    if response.status_code != 200:
        print(f"Failed to fetch URL: {link}")
        return set()
    soup = BeautifulSoup(response.content, features="html.parser")
    table = soup.find("table", class_=["wikitable","article-table"])
    try:
        trs = table.find_all("tr")[1:-1]
    except:
        print(link, "ERROR 1")
        return {}

    for tr in trs:
        tds = tr.find_all("td")
        armorPiece = tds[0].text.strip()
        amnt_text = str(tds[2])
        amnt_items = amnt_text.split("<br/>")
        result = {}
        for amnt_item in amnt_items:
            try:
                quantity, item_html = amnt_item.split(" ", 1)
            except:
                print(link,"ERROR 2")
                return {}
            if "<td>" in quantity:
                quantity = quantity[4:]
            item_soup = BeautifulSoup(item_html, 'html.parser')
            item_link = item_soup.find('a')
            if item_link:
                item_name = item_link.get_text(strip=True)
                result[item_name] = quantity
            else:
                print(f"No <a> tag found in: {item_html}")
        armorDict[armorPiece] = result

    return armorDict

if __name__ == "__main__":
    print(findSet("https://valheim.fandom.com/wiki/Troll_Set"))

