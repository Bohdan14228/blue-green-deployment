# blue-green-deployment

Project[https://roadmap.sh/projects/blue-green-deployment](https://roadmap.sh/projects/blue-green-deployment)

1. Create two docker images from Dockerfiles

2. Start servises
   ```bash
   docker compose up -d
   ```

3. Change trafick
   ```bash
   docker exec -it nginx-proxy /bin/bash
   apt update && apt install nano
   nano /etc/nginx/nginx.conf

   Choose service, and save file
   upstream app_upstream {
        #server app_blue:3000;
       	server app_green:3000; 
    }

   nginx -s reload
   ```

   
