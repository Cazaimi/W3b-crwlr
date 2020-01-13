const os = require('os'),
  { StaticPool } = require('node-worker-threads-pool');

module.exports = {
  init (number, path, workerData) {
    return new StaticPool({
      size: number || os.cpus().length,
      task: path,
      workerData
    });
  },

  destroy (pool) {
    if (!pool) {
      return undefined;
    }

    return pool.destroy();
  },

  enqueue (pool, cb, ...args) {
    return pool.exec(...args)
      .then(function (...results) {
        return cb(null, ...results);
      })
      .catch(function (err) {
        return cb(err);
      });
  }
};
