# URL Parameters

There are multiple parameters available that you can used along with the base URL (`https://sehilyi.github.io/goscan/`). The pattern of using the parameters is like the following:

```
https://sehilyi.github.io/goscan/?[parameter1]=[value1]&[parameter2]=[value2]
```

The supported parameters are as follows:

| Parameter | Description | Example |
|---|---|---|
| `demoIndex` | Index of the demo, starting from `0` | `3` (fourth example) |
| `domain` | A pair of absolute genomics positions | `209114527-458365147` |
| `showSamples` | Whether to show the sample overview upon landing the page | `true` or `false` |
| `external` | URL to data config | `https://gist.githubsercontent.com/sehilyi/example-datahub.json` |

!> The `external` parameter should be positioned at the last if multiple parameters are used.
<br/><br/>
✅ **Correct**
<br/>
https://sehilyi.github.io/goscan/?showSamples=true&external=[URL]
<br/><br/>
❌ **Incorrect**
<br/>
https://sehilyi.github.io/goscan/?external=[URL]&showSamples=true
<br/><br/>
This allows the external URL to have its own parameters (e.g., authenticated preassigned URL)