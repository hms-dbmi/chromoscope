#%%
import requests

for i in range(98):
    url = f'https://genomebrowserdata.s3.amazonaws.com/cnv/sample_{i+1}.tsv'
    r = requests.get(url, allow_redirects=True)
    open(f'data/sample_{i+1}.tsv', 'wb').write(r.content)

    url = f'https://genomebrowserdata.s3.amazonaws.com/sv/sample_{i+1}.bedpe'
    r = requests.get(url, allow_redirects=True)
    open(f'data/sample_{i+1}.bedpe', 'wb').write(r.content)
# %%
