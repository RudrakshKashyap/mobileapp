import tkinter as tk

window = tk.Tk()

window.title('My App')

window.geometry('400x400')

#LABEL
title = tk.Label(text="Hello world!", font=("Times New Roman",20))
title.grid()

button = tk.Button(text='Click me',bg="red")
button.grid()

entry_field1 = tk.Entry()
entry_field1.grid(column=0,row=100)

text = tk.Text(master=window,height=10, width=10)
text.grid()
window.mainloop( )
