module.exports = {
  apps: [
    {
      name: "campus-used-book-platform",
      cwd: __dirname,
      script: "server/src/app.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      },
      max_memory_restart: "300M",
      autorestart: true,
      watch: false
    }
  ]
};
