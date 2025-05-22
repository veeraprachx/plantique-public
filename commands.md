# Commands
1. Build frontend image and push to dockerhub:
   ```bash
   cd frontend/
   docker build --target production -t veeraprachv/plantique-frontend:latest . 
   docker push veeraprachv/plantique-frontend:latest
   ```
2. Build backend image and push to dockerhub:
    ```
    cd backend/
    docker build --target production -t veeraprachv/plantique-backend:latest .
    docker push veeraprachv/plantique-backend:latest
    ```
3. Start docker frontend & backend service
    ```
    docker-compose up --build
    ```
4. Stop docker frontend & backend service
    ```
    docker-compose down
    ```
5. Build frontend and backend image and push to dockerhub:
    ```
   cd frontend/
   docker build --target production -t veeraprachv/plantique-frontend:latest . 
   docker push veeraprachv/plantique-frontend:latest
   cd ../backend/
   docker build --target production -t veeraprachv/plantique-backend:latest .
   docker push veeraprachv/plantique-backend:latest
   cd ..
   ```
6. Stop the production
    ```
    cd production/
    microk8s kubectl delete deployments --all
    ```

   