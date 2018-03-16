import numpy as np
import pandas as pd

df = pd.read_csv("/Users/sabrinajiang/03-Experiment/python/result_all.csv")
print(df.head())
data = df[['Vis','TruePercent','ReportedPercent']]
print(data)
data['Log Error'] = np.log2(abs(data['ReportedPercent']-data['TruePercent']) + 1/8)
# data = data[(data['Vis'] == 'BarChart')].sort_values(by="Log Error", ascending=False)

grouped=data['Log Error'].groupby(data['Vis'])

mean = grouped.mean()
mean.columns = ["Vis","Avg"]
# print(mean.columns)

import matplotlib.pyplot as plt

plt.bar(mean.index,mean)
plt.show()
