import requests
import _thread
items = []
count = 0
#searches a page for the item
def Searching(page,theitem):
    global count
    data = requests.get(url = "https://api.hypixel.net/skyblock/auctions" , params = {"page":str(page)}).json()
    auctions = data["auctions"]
    for auction in auctions:
        try:
                # makes the input correctly cased (lapis =Lapis)
            if auction["bin"] and str(auction["item_name"]).count(theitem.title()) > 0:
                items.append([auction["item_name"], auction["starting_bid"]])
        except KeyError:
            pass
    count += 1
#creates multiple threads to search each page
def Search(theitem):
    global items
    data = requests.get(url = "https://api.hypixel.net/skyblock/auctions" , params = {"page":str(1)}).json()
    for page in range(0,data["totalPages"]):
        _thread.start_new_thread (Searching,(page,theitem,))
_thread.start_new_thread (Search,("yellow",))
while count < requests.get(url = "https://api.hypixel.net/skyblock/auctions" , params = {"page":str(1)}).json()["totalPages"]:
    continue  
items2 = []
items3 = []
for y in items:
    Lowest = 0
    for z in items:
        if y[0] == z[0] and y[1] <= z[1]:
            continue
        elif y[0] != z[0]:
            continue
        else:
            Lowest += 1
            continue
    if Lowest == 1: 
        items2.append(y)
for p in items2:
    if p not in items3:
        items3.append(p)



items4 = []
for y in items:
    Lowest = True
    for z in items:
        if y[0] == z[0] and y[1] <= z[1]:
            continue
        elif y[0] != z[0]:
            continue
        else:
            Lowest = False
            break
    if Lowest:
        items4.append(y)
items5 = []
willing = int(input("how much are you willing to spend"))
for y in items3:
    for z in items4:
        if y[0] == z[0]:
            J = y[1] - z[1]
            if y[1] < willing:
                items5.append([y[0],J])
items5.sort(reverse=True, key=lambda x: x[1])
return(items5)


