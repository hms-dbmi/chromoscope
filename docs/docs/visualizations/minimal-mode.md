---
title: Minimal Mode
sidebar_position: 9
---

# Minimal Mode

To make Chromoscope easier to embed within other websites, we provide a **minimal user interface** that maximizes screen space usage.

---

## How to Enable Minimal Mode

You can activate minimal mode by adding the query parameter `minimal_mode=true` to the application URL. For example:

[Minimal Mode Demo URL](https://chromoscope.bio/app/?minimal_mode=true&demoIndex=0&domain=1-249250621&external=https://somatic-browser-test.s3.us-east-1.amazonaws.com/SPECTRUM/SPECTRUM_config_with_clinicalInfo_sorted_aws.json)



---

## Example Integration

Chromoscope can be embedded in other applications through an iframe. For instance, cBioPortal includes Chromoscope using this approach:

[Example on cBioPortal](https://www.cbioportal.org/patient/openResource_CHROMOSCOPE?studyId=pancan_pcawg_2020&caseId=DO2706)

---

## Notes

- `minimal_mode=true` hides non-essential UI components to save space.  
- This mode is intended for embedding scenarios (dashboards, portals, or apps) where screen real estate is limited.
