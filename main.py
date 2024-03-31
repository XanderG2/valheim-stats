import tkinter as tk
import json

root = tk.Tk()
root.config(width=900, height=500)
root.title("Valheim Material Calculator By Xander")

total = {}

def mainmenu():
    button1 = tk.Button(root, text="Misc       ", command=lambda:display("misc")).grid(row=0, column=0)
    button2 = tk.Button(root, text="Crafting   ", command=lambda:display("crafting")).grid(row=0, column=1)
    button3 = tk.Button(root, text="Building   ", command=lambda:display("building")).grid(row=0, column=2)
    button4 = tk.Button(root, text="Furniture", command=lambda:display("furniture")).grid(row=0, column=3)

    button5 = tk.Button(root, text="Materials", command=lambda:display("materials")).grid(row=1, column=0)

    button6 = tk.Button(root, text="Food       ", command=lambda:display("food")).grid(row=2, column=0)
    button7 = tk.Button(root, text="Tools      ", command=lambda:display("tools")).grid(row=2, column=1)
    button8 = tk.Button(root, text="Weapons    ", command=lambda:display("weapons")).grid(row=2, column=2)
    button11 = tk.Button(root, text="Armour     ", command=lambda:display("armour")).grid(row=2, column=3)

    button9 = tk.Button(root, text="View Total", command=lambda: view(total)).grid(row=3, column=1)
    button10 = tk.Button(root, text="Clear Total", command=clear).grid(row=3, column=2)
    root.mainloop()

def display(file):
    top = tk.Toplevel(root)
    top.title(f"Valheim Material Calculator By Xander | {file}")
    with open(f"data/{file}.json", "r") as f:
        data = json.loads(f.read())
    row = 0
    col = 0
    for entry in data.keys():
        button = tk.Button(top, text=entry, command=lambda items=data[entry]: add(items)).grid(row=row, column=col)
        row += 1
        if row > 7:
            row = 0
            col += 1

def add(items):
    global total
    for item_ in items:
        total[item_] = total.get(item_, 0) + int(items[item_])

def view(total):
    top = tk.Toplevel(root)
    totalFormatted = ""
    for key, value in total.items():
        totalFormatted += f"{key} x{value}\n"
    tk.Label(top, text=str(totalFormatted)).grid(row=0, column=0)

def clear():
    global total
    total.clear()

mainmenu()
