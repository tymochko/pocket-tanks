let io = require('socket.io');
let express = require('express');
let app = express();
let client = io();

import { invite } from './invitation';
import { gameSocket } from './gameSocket';
import { chat } from './chat';

app.io = client;

invite(client);
gameSocket(client);
chat(client);

module.exports = app;
