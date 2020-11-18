import cluster from 'cluster';
const COUNTDOWN = 'countdown';

export default async (processFn: Function, numCPUs: number) => {
  if (!cluster.isMaster) {
    console.log(`Worker ${process.pid} started`);
    await processFn();
    process.send(COUNTDOWN);
    return process.exit(0);
  } else {
    for (let i = 0; i < numCPUs; i += 1) {
      cluster.fork();
    }

    return new Promise(resolve => {
      let count = numCPUs;
      cluster.on('message', (_worker, msg) => {
        if (msg === COUNTDOWN) {
          count -= 1;
          if (count === 0) {
            resolve();
          }
        }
      });
    });
  }
  
}
