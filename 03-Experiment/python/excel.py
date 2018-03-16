from glob import glob

with open('result_all.csv', 'a') as singleFile:
    for csv in glob('/Users/sabrinajiang/03-Experiment/data/*.csv'):
        if csv == 'result_all.csv':
            pass
        else:
            for line in open(csv, 'r'):
                singleFile.write(line)
                # print(line)