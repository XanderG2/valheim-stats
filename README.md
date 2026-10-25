# Valheim Stats Material Calculator

_Work is currently being done to update to version 1.0.17_

Valheim material calculator for _most_ builds and tools/weapons/armour in the game.  
All data is pulled from [valheim cheats](https://valheimcheats.com/).

---

## Files & Folders

`scripts/new.py` the new script that collects all the crafting recipes
`data/` folder contains all of the data collected from the wiki in json files.  
`index.html` redirects to...
`website/index.html` contains nothing basically, it all gets overwritten by...
`website/script.js` displays the data as a "shopping list".  
`website/style.css` contains the CSS stylings for the website.

---

### DEPRECATED

---

`gui.py` allows you to visualise the data using python. This should run without any external libraries installed.  
`process.py` collects data based on the input of line 79.  
`processSetPages.py` does the same as above but for pages that contain sets of items in a table, not individual items.  
`combine.py` combines all of the JSON files in `data/` into one.

---

## Purpose

I wanted to test my JavaScript skills whilst having fun, and I thought no
better way than to make a tool for one of my favourite games!

Enjoy :)
