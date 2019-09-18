module.exports = {
  apps: [{
    name: 'module-reviews',
    script: 'server/server.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-212-163-195.compute-1.amazonaws.com',
      key: '~/.ssh/hratx43-FEC-Reviews-Module.pem',
      ref: 'origin/master',
      repo: 'git@github.com:shazamazon/module-reviews.git',
      path: '/home/ubuntu/',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
};