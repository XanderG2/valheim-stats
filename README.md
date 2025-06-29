Valheim Stats Material Calculator
===

Valheim material calculator for *most* builds and tools/weapons/armour in the game.  
All data is pulled from the [valheim wiki](https://valheim.fandom.com).

---

## Files & Folders
gui.py allows you to visualise the data using python. This should run without any external libraries installed.  
process.py collects data based on the input of line 79.  
processSetPages.py does the same as above but for pages that contain sets of items in a table, not individual items.  
combine.py combines all of the json files in data/ into one.  
data/ folder contains all of the data collected from the wiki in json files, in different categories and all.  
index.html redirects to  
website/index.html contains nothing basically, it all gets overwritten by  
website/script.js displays the data as a "shopping list".  
website/style.css contains the css stylings for the website.  

---

## Purpose
I wanted to test my JavaScript skills whilst having fun, and i thought no
better way than to make a tool for one of my favourite games!

enjoy :)
