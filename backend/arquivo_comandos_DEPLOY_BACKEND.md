
sudo ln -s /etc/nginx/sites-available/terceiros.conf /etc/nginx/sites-enabled/



uwsgi --socket /var/www/terceiros/backend/terceiros.sock --module core.wsgi --chmod-socket=666



sudo nano /etc/systemd/system/terceiros.service









[Unit]
Description=uWSGI instance to serve terceiros
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/var/www/terceiros/backend
ExecStart=/var/www/terceiros/backend/venv/bin/uwsgi --ini /var/www/terceiros/backend/terceiros_uwsg>

[Install]
WantedBy=multi-user.target






sudo systemctl start terceiros


sudo systemctl enable terceiros
 
sudo systemctl status terceiros

