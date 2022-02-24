import string
import pandas as pd

def parse_tsv(filename, strip=0, margin=0):
    ret = [line.replace('\n','').split('\t') for line in open(filename, encoding='UTF-8')][strip:]
    for i in range(margin):
        [x.append('') for x in ret]
    ret = [[y.strip() for y in x] for x in ret]
    for i in range(margin):
        ret.append(['']*len(ret[0]))
    return ret


def parse_xlsx(filename):
    xls = pd.ExcelFile(filename)
    sh1 = xls.parse(sheet_name="Sheet1")
    return sh1

def append_xlsx(filename, col: string, data: list):
    df = pd.read_excel(filename)
    df[col] = pd.DataFrame(data)
    df.to_excel(filename, index=False)
    