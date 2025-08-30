# Multi-Service App: Docker + Kubernete

This project demonstrates how to build and deploy a **multi-service application** using Docker and Kubernetes.

It includes:
A React frontend
Express.js backend services (Auth, Products, Orders)
An API Gateway for routing
Docker for containerization
Kubernetes for orchestration

By following this guide, **you’ll spin up the entire stack step-by-step**, even if you’re a beginner.


## 🗂 Project Structure

```
ecommerce-microservices/
│
├── api-gateway/
├── auth-service/
├── products-service/
├── orders-service/
├── frontend/
├── kubernetes-manifests/
└── docker-compose.yaml
```

Each folder contains a microservice with its own `Dockerfile`.



## Step-by-Step Guide (Copy/Paste Friendly)

### Step 1: Prepare Project Folders

```bash
# Create project directory
mkdir ecommerce-microservices && cd ecommerce-microservices

# Create services
mkdir frontend api-gateway auth-service products-service orders-service

# Create Kubernetes folder
mkdir kubernetes-manifests
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/preparing%20our%20folders.png)


###  Step 2: Setup Backend Services

#### 🗂 `auth-service`

```bash
cd auth-service
npm init -y
npm install express
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/set%20up%20backend%20service%20auth%20service.png)

Create `index.js`:

```js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    return res.json({ success: true, token: 'abc123' });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.listen(5001, () => console.log('Auth Service running on port 5001'));
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20our%20index%20js%20file%20and%20adding%20the%20code%20in%20authservice.png)

Create `Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["node", "index.js"]
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20our%20dockerfile%20in%20authservice.png)

Go back:

```bash
cd ..
```

---

#### 🗂 `products-service`

```bash
cd products-service
npm init -y
npm install express
```
![Image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/set%20up%20backend%20service%20for%20product%20service.png)

Create `index.js`:

```js
const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'Laptop', price: 1500 },
  { id: 2, name: 'Phone', price: 800 }
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(5002, () => console.log('Products Service running on port 5002'));
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20index%20js%20in%20product%20service.png)

Create `Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5002
CMD ["node", "index.js"]
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20index%20js%20in%20product%20service.png)

Go back:

```bash
cd ..
```

---

#### 🗂 `orders-service`

```bash
cd orders-service
npm init -y
npm install express
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/set%20up%20backend%20for%20order%20service.png)

Create `index.js`:

```js
const express = require('express');
const app = express();

const orders = [
  { id: 1, product: 'Laptop', quantity: 2 },
  { id: 2, product: 'Phone', quantity: 1 }
];

app.get('/orders', (req, res) => {
  res.json(orders);
});

app.listen(5003, () => console.log('Orders Service running on port 5003'));
```
![Image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20index%20js%20in%20order%20services.png)

Create `Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5003
CMD ["node", "index.js"]
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20docker%20file%20for%20order%20service%20app.png)

Go back:

```bash
cd ..
```

---

###  Step 3: Setup API Gateway

```bash
cd api-gateway
npm init -y
npm install express http-proxy-middleware
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/setting%20up%20api%20gateway.png)

Create `index.js`:

```js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:5001', changeOrigin: true }));
app.use('/products', createProxyMiddleware({ target: 'http://products-service:5002', changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: 'http://orders-service:5003', changeOrigin: true }));

app.listen(5000, () => console.log('API Gateway running on port 5000'));
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20index%20js%20in%20api%20gateway.png)

Create `Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/docker%20file%20created%20in%20api%20gateway%20folder.png)

Go back:

```bash
cd ..
```

---

###  Step 4: Setup Frontend

```bash
cd frontend
npx create-react-app .
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/setting%20up%20our%20frontend%20.png)

Update `src/App.js`:

```js
function App() {
  return (
    <div>
      <h1>Microservices App</h1>
      <p>Auth, Products, Orders, API Gateway running!</p>
    </div>
  );
}
export default App;
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/Update%20src%20App%20js%20in%20frontend%20folder.png)

Create `Dockerfile`:

```Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "build"]
EXPOSE 3000
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/docker%20file%20in%20our%20frontend%20folder.png)

Go back:

```bash
cd ..
```


### Step 5: Docker Compose File

Create `docker-compose.yaml`:

```yaml
version: "3.8"

services:
  auth-service:
    build: ./auth-service
    ports:
      - "5001:5001"

  products-service:
    build: ./products-service
    ports:
      - "5002:5002"

  orders-service:
    build: ./orders-service
    ports:
      - "5003:5003"

  api-gateway:
    build: ./api-gateway
    ports:
      - "5000:5000"
    depends_on:
      - auth-service
      - products-service
      - orders-service

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - api-gateway
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/creating%20docker%20compose%20file%20at%20the%20root%20of%20the%20project.png)


###  Step 6: Run Locally

```bash
# Build and run all containers
docker-compose up --build
```
![image ](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/running%20docker%20compose%20to%20build%20all%20our%20apps.png)

![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20docker%20compose%20results%20ater%20running.png)

Test:

* Frontend: [http://localhost:3000](http://localhost:3000)
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/testing%20our%20frontend%20that%20has%20been%20built%20using%20docker.png)

* API Gateway: [http://localhost:5000](http://localhost:5000)

* Auth: \[http\://localhost:5000/auth]
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/auth%20working%20after%20docker%20compose.png)

* Products: \[http\://localhost:5000/products]
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/products%20running%20after%20docker%20compose.png)

* Orders: \[http\://localhost:5000/orders]
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/orders%20working%20after%20docker%20compose.png)

---

###  Step 7: Push Docker Images

```bash
# Login to Docker Hub
docker login

# Tag & Push each service
docker tag ecommerce-microservices-auth-service princetee/auth-service:latest
docker push princetee/auth-service:latest

docker tag ecommerce-microservices-products-service princetee/products-service:latest
docker push princetee/products-service:latest

docker tag ecommerce-microservices-orders-service princetee/orders-service:latest
docker push princetee/orders-service:latest

docker tag ecommerce-microservices-api-gateway princetee/api-gateway:latest
docker push princetee/api-gateway:latest

docker tag ecommerce-microservices-frontend princetee/frontend:latest
docker push princetee/frontend:latest
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/tagging%20and%20pushing%20our%20built%20image%20to%20docker%20hub.png)

---

###  Step 8: Kubernetes Manifests

All Kubernetes YAMLs are in `kubernetes-manifests/`.
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/enter%20into%20the%20kubernetes%20manifest%20file%20to%20create%20our%20yaml%20files.png)

Example: `auth-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-container
        image: princetee/auth-service:latest
        ports:
        - containerPort: 5001
---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - port: 5001
      targetPort: 5001
   type: clusterIP   
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20auth%20yaml.png)

`products.yaml` file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: products-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: products-service
  template:
    metadata:
      labels:
        app: products-service
    spec:
      containers:
      - name: products-container
        image: princetee/products-service:latest
        ports:
        - containerPort: 5002
---
apiVersion: v1
kind: Service
metadata:
  name: products-service
spec:
  selector:
    app: products-service
  ports:
    - port: 5002
      targetPort: 5002
  type: ClusterIP

```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20product%20yaml%20file.png)


`orders.yaml` file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: orders-service
  template:
    metadata:
      labels:
        app: orders-service
    spec:
      containers:
      - name: orders-container
        image: princetee/orders-service:latest
        ports:
        - containerPort: 5003
---
apiVersion: v1
kind: Service
metadata:
  name: orders-service
spec:
  selector:
    app: orders-service
  ports:
    - port: 5003
      targetPort: 5003
  type: ClusterIP

```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20order%20yaml.png)

`api-gateway.yaml` file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway-container
        image: princetee/api-gateway:latest
        ports:
        - containerPort: 5000
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway-service
spec:
  selector:
    app: api-gateway
  ports:
    - port: 80
      targetPort: 5000
  type: LoadBalancer

```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20api%20gateway%20yaml%20file.png)

`frontend.yaml` file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend-container
        image: princetee/frontend:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer

```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/content%20of%20frontend%20yaml.png)

---

###  Step 9: Deploy to Kubernetes

```bash
kubectl apply -f kubernetes-manifests/
kubectl get pods
kubectl get services
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20manifest%20created%20pod%20running%20and%20everthing%20working.png)

---

### 🛠 Troubleshooting
Testing our kubernetes set up

we could see in the logs that frontend-service has <pending> for EXTERNAL-IP

#### Option A Port-forward frontend:

```bash
kubectl port-forward svc/frontend-service 3000:80
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20frontend%20serving%20port%203000%20on%20kubernetes.png)

Visit: [http://localhost:3000](http://localhost:3000)
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20frontend%20app%20working%20on%20kubernetes.png)

### Option B (Alternative): Change Service Type to NodePort
Edit frontend.yaml:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 3000
      nodePort: 30080
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/new%20content%20of%20frontend%20yaml%20on%20nodeport.png)

Apply:
```bash
kubectl apply -f kubernetes-manifests/frontend.yaml
```
Access frontend in browser:
http://localhost:30080

![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20frontend%20serving%20port%20300080%20on%20kubernetes.png)

#### Encountered Failed to connect to localhost port 31318 after 2225 ms: Could not connect to server

![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/our%20api%20gateway%20not%20serving%20the%20opened%20port.png)

On Docker Desktop Kubernetes, LoadBalancer doesn’t work out of the box (there’s no external cloud load balancer).

That port 31318 is internal to the Kubernetes cluster unless we expose it manually.

Confirm API Gateway is working inside the cluster
Run this to test API Gateway from inside Kubernetes:

```bash
kubectl exec -it $(kubectl get pod -l app=api-gateway -o jsonpath='{.items[0].metadata.name}') -- sh
```
Now you’re inside the container. From there run:

```bash
curl http://localhost:5000/products
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/API%20Gateway%20running%20from%20inside%20Kubernetes.png)

if this works, your API Gateway and services (products, orders) are working inside Kubernetes, but your host machine can’t access it yet.

Type exit to leave the container.

Expose API Gateway app by adding/changing the deployment section of the yaml file to below:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
spec:
  type: NodePort
  selector:
    app: api-gateway
  ports:
    - port: 80
      targetPort: 5000
      nodePort: 30050
```
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/edited%20content%20of%20our%20api%20gateway%20yaml.png)

Apply:

```bash
kubectl apply -f kubernetes-manifests/api-gateway.yaml
```

Test:

```bash
curl http://localhost:30050/products
```
![imgae](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/running%20he%20curl%20on%20the%20terminal.png)

---

###  Error 1: API Routes Not Responding (e.g., `Cannot GET /products`)

When testing API routes through the API Gateway, you might see errors like:

```bash
curl http://localhost:5000/products
Cannot GET /
```

**Cause:**

* The API Gateway is not routing requests properly to the backend services.
* Your backend services (`auth-service`, `products-service`, `orders-service`) may not have the expected routes configured.

**Fix:**

1. **Check API Gateway Proxy Targets**
   Open `api-gateway/index.js` and ensure each service has the correct proxy configuration:

   ```js
   app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:5001', changeOrigin: true }));
   app.use('/products', createProxyMiddleware({ target: 'http://products-service:5002', changeOrigin: true }));
   app.use('/orders', createProxyMiddleware({ target: 'http://orders-service:5003', changeOrigin: true }));
   ```

2. **Confirm Routes in Each Service**
   Each service must expose routes matching the proxies:

   * **auth-service/index.js**

     ```js
     app.post('/', (req, res) => { ... });
     ```
   * **products-service/index.js**

     ```js
     app.get('/', (req, res) => { ... });
     ```
   * **orders-service/index.js**

     ```js
     app.get('/', (req, res) => { ... });
     ```

3. Restart your API Gateway container after fixing the routes.

---

### Error : Docker Image Tagging & Pushing Fails

When attempting to push Docker images to Docker Hub, you might encounter:

```bash
Error response from daemon: No such image: auth-service:latest
```

**Cause:**
The local Docker images were not properly tagged with your Docker Hub username before pushing.

**Fix:**

1. **Tag Your Docker Images Correctly**
   Replace `princetee` with **your Docker Hub username**:

   ```bash
   docker tag ecommerce-microservices-auth-service princetee/auth-service:latest
   docker tag ecommerce-microservices-products-service princetee/products-service:latest
   docker tag ecommerce-microservices-orders-service princetee/orders-service:latest
   docker tag ecommerce-microservices-api-gateway princetee/api-gateway:latest
   docker tag ecommerce-microservices-frontend princetee/frontend:latest
   ```

2. **Push the Tagged Images to Docker Hub**

   ```bash
   docker push princetee/auth-service:latest
   docker push princetee/products-service:latest
   docker push princetee/orders-service:latest
   docker push princetee/api-gateway:latest
   docker push princetee/frontend:latest
   ```

3. **Verify on Docker Hub**
   Login to your Docker Hub account and confirm the images are uploaded.

---

### Pro Tip

Always rebuild images with the correct tags before pushing:

```bash
docker-compose build
```

And ensure you’re logged into Docker Hub:

```bash
docker login
```


## Quick Test Checklist

| Component        | Test Command/URL                                    |
| ---------------- | --------------------------------------------------- |
| API Gateway      | `curl http://localhost:30050/products`              |
| Auth Service     | `curl http://localhost:30050/auth/login`            |
| Products Service | Routed via API Gateway                              |
| Orders Service   | Routed via API Gateway                              |
| Frontend         | Open [http://localhost:3000](http://localhost:3000) |

---

From the brower on  http://localhost:30050/products`

![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/api%20gateway%20routing%20traffic%20to%20product.png)

From API gateway port we can reach content of products on http://localhost:30050/products/products

![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/from%20api%20gateway%20port%2C%20we%20can%20reach%20content%20of%20products.png)

From the brower on  http://localhost:30050/orders`
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/reaching%20orders%20through%20api%20gateway.png)

From API gateway port we can reach content of products on http://localhost:30050/orders/orders
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/getting%20contents%20of%20orders%20through%20api%20gateway.png)

From the brower on  http://localhost:30050/auth`
![image](https://github.com/Prince-Tee/microservices-docker-kubernetes/blob/main/Screenshots%20from%20my%20environment/auth%20running%20from%20api%20gateway%20port.png)

## 📦 Built With

* Docker
* Kubernetes
* React
* Node.js (Express)
* http-proxy-middleware

---

## Conclusion

This project demonstrates how to design and deploy a simple **microservices-based architecture** using **Docker** and **Kubernetes**. It integrates a React frontend, Node.js backend services, and an API Gateway to showcase how individual services can communicate within a containerized environment.

By containerizing each service and orchestrating them with Kubernetes, we achieved:

* **Scalability**: Easily increase replicas for any service.
* **Portability**: Run the entire stack consistently across environments.
* **Separation of Concerns**: Each service focuses on a single responsibility.

This setup provides a **solid foundation for learning microservices** and can be expanded with authentication, databases, CI/CD pipelines, and advanced orchestration techniques.

## ✍️ Author

**Taiwo Adebiyi** - [GitHub](https://github.com/Prince-Tee)
