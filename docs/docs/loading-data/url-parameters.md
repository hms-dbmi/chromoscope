---
sidebar_position: 5
---

# URL Parameters

There are multiple parameters available that you can used along with the base URL (`https://chromoscope.bio/app/`). The pattern of using the parameters is like the following:

```
https://chromoscope.bio/app/?[parameter1]=[value1]&[parameter2]=[value2]
```

The supported parameters are as follows:

| Parameter | Description | Example |
|---|---|---|
| `demoIndex` | Index of the demo, starting from `0` | `3` (fourth example) |
| `domain` | A pair of absolute genomics positions | `209114527-458365147` |
| `showSamples` | Whether to show the sample overview upon landing the page | `true` or `false` |
| `external` | URL to data config | `https://gist.githubsercontent.com/sehilyi/example-datahub.json` |

:::caution
The `external` parameter should be positioned at the last if multiple parameters are used.

✅ **Correct**

https://chromoscope.bio/app/?showSamples=true&external=[URL]

❌ **Incorrect**

https://chromoscope.bio/app/?external=[URL]&showSamples=true

This allows the external URL to have its own parameters (e.g., authenticated preassigned URL)
:::