from bs4 import BeautifulSoup
from subprocess import check_output

def checkPage(page):
    data = check_output(["curl", f"https://valheim.fandom.com{page}"])
    soup = BeautifulSoup(data, features="html.parser")
    table = soup.find("table", class_="wikitable")
    trs = table.find_all("tr")
    for tr in trs:
        tds = tr.find_all("td")
        print(tds)

checkPage("/wiki/Carapace_Armor")