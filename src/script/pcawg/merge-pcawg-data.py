#%%
import pandas as pd
import json
from urllib.request import urlopen

#%%
df = pd.read_csv('PCAWG.configs.tsv', delimiter='\t')
datahubs = df['config.link'].tolist()
# datahubs
# %%
merged = []
for url in datahubs:
    curr = json.load(urlopen(url))
    merged += curr
# %%
merged_object = json.dumps(merged, indent=4)
merged_object
# %%
with open("all-pcawg-data.json", "w") as out:
    out.write(merged_object)
# %%
