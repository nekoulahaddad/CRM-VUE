module.exports = {
  apps: [
    {
<<<<<<< HEAD
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
=======
      name: "csk_crm",
      script: "npm",
      args: "run start --prefix /var/www/td-csk-crm/server",
      time: true,
      exec_mode: "cluster",
      instances: 4,
      autorestart: true,
      listen_timeout: 5000,
      max_restarts: 50,
      watch: false,
      max_memory_restart: "1G",
      env: {
        PORT: 3001,
      },
    },
  ],
};
>>>>>>> 3af26b147cf4bea53172a9f39bc24c3b8c10cf1c
