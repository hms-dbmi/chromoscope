#%%
import json
# %%
overview_specs = json.load(open('overview-specs.json'))
overview_specs
# %%
for i, spec in enumerate(overview_specs):
    with open(f'output/overview_spec_{i}.json', 'w') as out:
        json.dump(spec, out, indent=2)
# %%
# node gosling-screenshot/gosling-screenshot.js output/overview_spec_.json img/overview_.jpeg