module.exports = {
  apps: [
    {
      name: 'csk_crm',
      script: 'npm',
	    args: "run start --prefix /var/www/td-csk-crm/server",
      time: true,
      exec_mode: 'cluster',
      instances: 4,
      autorestart: true,
      listen_timeout : 5000,
      max_restarts: 50,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3001
      }
    },
  ],
}
