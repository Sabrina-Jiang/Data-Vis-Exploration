import pandas as pd
import plotly
import plotly.plotly as py
import plotly.graph_objs as go

plotly.tools.set_credentials_file(username='Sabrinajiang', api_key='ZAXpbOYD8PbSLFLdqBvH')

df = pd.read_csv("/Users/sabrinajiang/02-DataVis-10ways/cars-sample.csv")
data = df[['Weight','MPG','Manufacturer']]

data = data.dropna()

label1 = data[(data['Manufacturer'] == 'bmw')]
label2 = data[(data['Manufacturer'] == 'ford')]
label3 = data[(data['Manufacturer'] == 'honda')]
label4 = data[(data['Manufacturer'] == 'mercedes')]
label5 = data[(data['Manufacturer'] == 'toyota')]

bmw = go.Scatter(x = label1['Weight'], y=label1['MPG'], mode = 'markers', name='bmw',
                   marker = dict(
                       size = (label1['Weight'] / 200),
                       opacity = 0.5,
                       color = 'pink'
                   )
)

ford = go.Scatter(x = label2['Weight'], y=label2['MPG'], mode = 'markers', name='ford',
                   marker = dict(
                       size = (label2['Weight'] / 200),
                       opacity = 0.5,
                       color = 'green'
                   )
)

honda = go.Scatter(x = label3['Weight'], y=label3['MPG'], mode = 'markers', name='honda',
                   marker = dict(
                       size = (label3['Weight'] / 200),
                       opacity = 0.5,
                       color = 'brown'
                   )
)

mercedes = go.Scatter(x = label4['Weight'], y=label4['MPG'], mode = 'markers', name='mercedes',
                   marker = dict(
                       size = (label4['Weight'] / 200) ,
                       opacity = 0.5,
                       color = 'blue'
                   )
)

toyota = go.Scatter(x = label5['Weight'], y=label5['MPG'], mode = 'markers', name='toyota',
                   marker = dict(
                       size = (label5['Weight'] / 200) ,
                       opacity = 0.5,
                       color = 'purple'
                   )
)

layout = go.Layout(
     width=800,
     height=800,
     xaxis = dict(title = 'Weight',showgrid = True, nticks = 4, range = (2000,3000,4000,5000)),
     yaxis = dict(title = 'MPG', showgrid = True, nticks = 4, range = [10,20,30,40]),
                   )

data = [bmw, ford, honda, mercedes, toyota]
fig = go.Figure(data = data, layout = layout)
py.plot(fig, filename='styled-scatter')