/**
 * @file This plugin is to object detection data from coco format. Make sure that
 * the data is conform to expectation.
 */

import { ArgsType, DataCollectType } from '@pipcook/pipcook-core';
import { spawn } from 'child_process';
import * as fs from 'fs-extra';

const imageDetectionDataCollect: DataCollectType = async (args: ArgsType): Promise<void> => {
  const {
    url, totalNum = 1000,
    dataDir
  } = args;
  await fs.ensureDir(dataDir);
  if (!url || !totalNum) return console.log('这些参数必选：type, url, totalNum');


  const cmd = spawn('node', [__dirname + '/lib/gen.js', totalNum, url, dataDir + '/train']);

  cmd.stdout.on('data', data => {
    console.log(data.toString().trim());
  });

  cmd.stderr.on('data', data => {
    console.error(data.toString().trim());
  });
  return new Promise(resolve => {
    cmd.on('close', () => {
      resolve();
    });
  });
};

export default imageDetectionDataCollect;
