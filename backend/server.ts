const axios = require('axios');

type AxiosInstance = typeof axios;

interface Container {
  Id: string;
  Image: string;
  Command: string;
  Created: number;
  Status: string;
  Ports: string[];
  Names: string[];
}

const axiosInstance: AxiosInstance = axios.create({
  socketPath: '/var/run/docker.sock',
});

async function getDockerContainers(): Promise<Container[]> {
  const response = await axiosInstance.get<Container[]>('/containers/json');
  const containers = response.data;

  return getDockerContainers;
}

async function main() {
  const containers = await getDockerContainers();
  console.log(containers);
}



// const app = express();

// // After a server is done with the unix domain socket, it is not automatically destroyed.
// // You must instead unlink the socket in order to reuse that address/path.
// // To do this, we delete the file with fs.unlinkSync()
// try {
//   fs.unlinkSync(SOCKETFILE);
//   console.log('Deleted the UNIX socket file.');
// } catch (err) {
//   console.log('Did not need to delete the UNIX socket file.');
// }

// app.get('/docker-data', async (req, res) => {
//   try {
//     // Use the Docker SDK to obtain the data that you need
//     const data = await docker.containers.list();

//     // Return the data to the user in a JSON format
//     res.json(data);
//   } catch (err) {
//     // Handle the error
//     console.log(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Start the extension server and the metrics server
// extensionServer.listen(SOCKETFILE, () => {
//   console.log(`🚀 Server listening on ${SOCKETFILE}`);
// });

// metricsServer.listen(METRICS_PORT, () => {
//   console.log(`📈 Metrics are available on ${METRICS_PORT}/metrics`);
// });

// process.on('SIGTERM', () => {
//   console.log('Received SIGTERM signal. Shutting down extension server...');

//   // Stop the server
//   extensionServer.close();
// });

// // import Bun from '@bun/bun';

// // const server: Response = Bun.serve({
// //   unix: '/run/guest-services/backend.sock',
// //   fetch(req) {
// //     if (req.url === '/test') {
// //       const message = req.body.message;
// //       return new Response('test from backend!');
// //     } else {
// //       return new Response('Not found', { status: 404 });
// //     }
// //   },
// // });

