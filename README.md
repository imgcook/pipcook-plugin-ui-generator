# @pipcook/plugins-ui-generator

The Pipcook plugin to generate UI samples for object detection and image classification pipelines.

### Description

Object detection or image classification require massive samples to train the model. This plug-in is a Pipcook plug-in, used to generate a large number of object detection or image classification samples.

### Principle

The input of this plug-in is a page that will randomly change every time it is refreshed. The page renders what sample looks like, and the global variables of the page contains labeling information.

![](https://img.alicdn.com/tfs/TB1k5DsrfzO3e4jSZFxXXaP_FXa-1454-494.png)

After getting this page, the plug-in will use Puppeteer to loop through the screenshot-refresh operation to generate massive samples with random changes.

### Parameters

| Parameter | Type   | Required | Description | 
|:----------|:-------|:---------|:------------|
| url       | string | true     | the url to the sample page |
| totalNum  | number | false    | the sample number, default value is 1000 |

### Example
```json
"dataCollect": {
  "package": "@pipcook/plugins-ui-generator",
  "params": {
    "url": "https://your-sample-page",
    "totalNum": 1000
  }
}
```
