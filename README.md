# pipcook-plugin-ui-generator

Generate UI samples for object detection and image classification pipelines.

## Introduction

Object detection or image classification require massive samples to train the model. This plug-in is a Pipcook plug-in, used to generate a large number of object detection or image classification samples.

## Principle

The input of this plug-in is a page that will randomly change every time it is refreshed. The page renders what sample looks like, and the global variables of the page contains labeling information.

![](https://img.alicdn.com/tfs/TB1k5DsrfzO3e4jSZFxXXaP_FXa-1454-494.png)

After getting this page, the plug-in will use Puppeteer to loop through the screenshot-refresh operation to generate massive samples with random changes.

## Instructions

[Example of use](test/index.js)
