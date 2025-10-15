import 'dotenv/config';
import localtunnel from 'localtunnel';

(async () => {
    const appTunnel = await localtunnel({ port: 5173, subdomain: 'fp-app-tunnel' });
    console.log('App tunnel:', appTunnel.url);

    const apiTunnel = await localtunnel({ port: 3000, subdomain: 'fp-api-tunnel' });
    console.log('API tunnel:', apiTunnel.url);
})();
