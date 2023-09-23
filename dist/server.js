"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
function getDockerContainers() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get('/containers/json', {
            socketPath: '/var/run/docker.sock',
            params: { all: true },
        });
        const containers = response.data;
        return containers;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const containers = yield getDockerContainers();
        console.log(containers);
    });
}
const app = (0, express_1.default)();
// After a server is done with the unix domain socket, it is not automatically destroyed.
// You must instead unlink the socket in order to reuse that address/path.
// To do this, we delete the file with fs.unlinkSync()
try {
    fs_1.default.unlinkSync('/var/run/docker.sock');
    console.log('Deleted the UNIX socket file.');
}
catch (err) {
    console.log('Did not need to delete the UNIX socket file.');
}
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use the Docker SDK to obtain the data that you need
        const data = yield getDockerContainers();
        // Return the data to the user in a JSON format
        res.json(data);
    }
    catch (err) {
        // Handle the error
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}));
// Start the extension server and the metrics server
app.listen('/var/run/docker.sock', () => {
    console.log(`🚀 Server listening on ${'/var/run/docker.sock'}`);
});
// import Bun from '@bun/bun';
// const server: Response = Bun.serve({
//   unix: '/run/guest-services/backend.sock',
//   fetch(req) {
//     if (req.url === '/test') {
//       const message = req.body.message;
//       return new Response('test from backend!');
//     } else {
//       return new Response('Not found', { status: 404 });
//     }
//   },
// });
