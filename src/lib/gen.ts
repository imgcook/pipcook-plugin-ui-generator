import fs from 'fs';
import { v4 as uuid } from 'uuid';
import os from 'os';
import puppeteer from 'puppeteer';

import json2xml from './json2xml';
import processPool from './processPool';

const numCPUs = Math.min(4, os.cpus().length);
const numCuncurrentPage = 5;

export interface GenArgsType {
  totalNum: number;
  url: string;
  dirPrefix?: string;
  vw?: number;
  vh?: number;
}

const gen = async ({ totalNum, url, dirPrefix = '', vw = 2000, vh = 3000 }: GenArgsType) => {
  if (fs.existsSync(dirPrefix)) fs.rmdirSync(dirPrefix, { recursive: true });
  fs.mkdirSync(dirPrefix, { recursive: true });
  const genOnPage = async (p: any) => {
    await p.evaluate('window.update()');
    const json = await p.evaluate('window.json');
    const { width, height } = json.annotation.size;
    if (width > vw || height > vh) {
      console.warn('Pictrue is overflow', width, height);
      await genOnPage(p);
      return;
    }
    const filename = uuid();
    json.annotation.filename = `${filename}.jpg`;
    fs.writeFile(`${dirPrefix}/${filename}.xml`, json2xml(json), d => d);
    await p.screenshot({
      path: `${dirPrefix}/${filename}.jpg`,
      type: 'jpeg',
      quality: Math.min(100, Math.round(120000 / width)),
      clip: {
        x: 0, y: 0, width, height,
      },
    });
  };

  const genOnBrowser = async (numPerBrowser: number) => {
    const numPerPage = Math.ceil(numPerBrowser / numCuncurrentPage);
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    await Promise.all(Array.from({ length: numCuncurrentPage }).map(async (_, pageIndex) => {
      const p = await browser.newPage();
      await p.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
      await p.setDefaultNavigationTimeout(10000000);
      await p.setCacheEnabled(false);
      await p.goto(url, { waitUntil: 'networkidle2' });
      await p.waitForFunction('window.update');
      for (let i = 0; i < numPerPage; i += 1) {
        await genOnPage(p);
        console.log(`Process ${process.pid} and page ${pageIndex} generate ${i + 1} pictures`);
      };
    }));
    await browser.close();
  }

  const start = new Date().getTime();
  await processPool(() => genOnBrowser(Math.ceil(totalNum/numCPUs)), numCPUs);
  // await genOnBrowser();
  const time = (new Date().getTime() - start) / 1000;
  console.log('Total time: ', time);
};

const args = process.argv.slice(2);
gen( { totalNum: Number(args[0]), url: args[1], dirPrefix: args[2] });
