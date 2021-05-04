import apicache from 'apicache';

if (process.env.NODE_ENV !== 'production') {
  apicache.options({ enabled: false });
}

apicache.options({
  headers: {
    'cache-control': 'no-cache',
  },
  statusCodes: {
    include: [200],
  },
});

const cache = apicache.middleware;

export default cache;
