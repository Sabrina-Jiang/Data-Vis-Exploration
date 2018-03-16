import pandas as pd
import matplotlib.pyplot as plt
# import numpy as np


# load the data file
df = pd.read_csv("/Users/sabrinajiang/02-DataVis-10ways/cars-sample.csv")

# filter the data

data = df[['Weight','MPG','Manufacturer']]
# mpg = df['MPG']
# weight = df['Weight']
# manu = df['Manufacturer']
data = data.dropna()
# color = data['Manufacturer'].map({'bmw':'pink',
#                   'ford':'green',
#                   'honda':'brown',
#                   'mercedes':'blue',
#                   'toyota':'purple'})

print(df.head)

label1 = data[(data['Manufacturer'] == 'bmw')]
label2 = data[(data['Manufacturer'] == 'ford')]
label3 = data[(data['Manufacturer'] == 'honda')]
label4 = data[(data['Manufacturer'] == 'mercedes')]
label5 = data[(data['Manufacturer'] == 'toyota')]

# print(label1)
scatter1 = plt.scatter(label1['Weight'], label1['MPG'], s = (label1['Weight'] / 350) ** 2, alpha = 0.5, c = 'pink', label = 'bmw', edgecolors = 'none')
scatter2 = plt.scatter(label2['Weight'], label2['MPG'], s = (label2['Weight'] / 350) ** 2, alpha = 0.5, c = 'green', label = 'ford', edgecolors = 'none')
scatter3 = plt.scatter(label3['Weight'], label3['MPG'], s = (label3['Weight'] / 350) ** 2, alpha = 0.5, c = 'brown', label = 'honda', edgecolors = 'none')
scatter4 = plt.scatter(label4['Weight'], label4['MPG'], s = (label4['Weight'] / 350) ** 2, alpha = 0.5, c = 'blue', label = 'mercedes', edgecolors = 'none')
scatter5 = plt.scatter(label5['Weight'], label5['MPG'], s = (label5['Weight'] / 350) ** 2, alpha = 0.5, c = 'purple', label = 'toyota', edgecolors = 'none')

plt.xlim(1500,5100)
plt.ylim(8,50)
plt.xlabel("Weight")
plt.ylabel("MPG")

legend = plt.legend()

# set the tick marks fot axis
plt.xticks([2000,3000,4000,5000])
plt.yticks([10,20,30,40])

#set the grid
plt.grid(True)

plt.show()