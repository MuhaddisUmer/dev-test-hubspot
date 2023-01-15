/* -- set app title --*/
const AppTitle = 'DASHBOARD';

/* -- set app mode -- */
const AppMode = ['development'];

/* -- set API URLs --*/
const development = 'http://localhost:8080/https://api.hubapi.com/crm/v3';
const production = 'http://localhost:8080/https://api.hubapi.com/crm/v3';
const testing = 'http://localhost:8080/https://api.hubapi.com/crm/v3';

let SocketUrl;
let env = AppMode[0] || 'development', token = "pat-na1-42f6af9b-5d2c-40ee-9a0a-ae61cbea96cf";

switch (AppMode[0]) {
  case 'development':
    SocketUrl = development;
    break;
  case 'production':
    SocketUrl = production;
    break;
  case 'testing':
    SocketUrl = testing;
    break;
  default:
    SocketUrl = 'http://192.168.18.106:4000';
}

let ApiUrl = `${SocketUrl}`;
export { AppTitle, ApiUrl, SocketUrl, token, env };