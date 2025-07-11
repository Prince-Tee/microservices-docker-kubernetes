# 🚀Multi-Service App: Docker + Kubernetes

This project demonstrates how to build and deploy a **multi-service application** using Docker and Kubernetes.

It includes:
✅ A React frontend
✅ Express.js backend services (Auth, Products, Orders)
✅ An API Gateway for routing
✅ Docker for containerization
✅ Kubernetes for orchestration

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

---

## 🚀 Step-by-Step Guide (Copy/Paste Friendly)

### ✅ Step 1: Prepare Project Folders

```bash
# Create project directory
mkdir ecommerce-microservices && cd ecommerce-microservices

# Create services
mkdir frontend api-gateway auth-service products-service orders-service

# Create Kubernetes folder
mkdir kubernetes-manifests
```

---

### ✅ Step 2: Setup Backend Services

#### 🗂 `auth-service`

```bash
cd auth-service
npm init -y
npm install express
```

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

Go back:

```bash
cd ..
```

---

### ✅ Step 3: Setup API Gateway

```bash
cd api-gateway
npm init -y
npm install express http-proxy-middleware
```

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

Go back:

```bash
cd ..
```

---

### ✅ Step 4: Setup Frontend

```bash
cd frontend
npx create-react-app .
```

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

Go back:

```bash
cd ..
```

---

### ✅ Step 5: Docker Compose File

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

---

### ✅ Step 6: Run Locally

```bash
# Build and run all containers
docker-compose up --build
```

Test:

* Frontend: [http://localhost:3000](http://localhost:3000)
* API Gateway: [http://localhost:5000](http://localhost:5000)
* Auth: \[http\://localhost:5000/auth]
* Products: \[http\://localhost:5000/products]
* Orders: \[http\://localhost:5000/orders]

---

### ✅ Step 7: Push Docker Images

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

---

### ✅ Step 8: Kubernetes Manifests

All Kubernetes YAMLs are in `kubernetes-manifests/`.

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
```

*(Repeat for other services)*

---

### ✅ Step 9: Deploy to Kubernetes

```bash
kubectl apply -f kubernetes-manifests/
kubectl get pods
kubectl get services
```

---

### 🛠 Troubleshooting

✅ Port-forward frontend:

```bash
kubectl port-forward svc/frontend-service 3000:80
```

Visit: [http://localhost:3000](http://localhost:3000)

✅ Expose API Gateway:

```yaml
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 5000
      nodePort: 30050
```

Apply:

```bash
kubectl apply -f kubernetes-manifests/api-gateway.yaml
```

Test:

```bash
curl http://localhost:30050/products
```

---

## ✅ Quick Test Checklist

| Component        | Test Command/URL                                    |
| ---------------- | --------------------------------------------------- |
| API Gateway      | `curl http://localhost:30050/products`              |
| Auth Service     | `curl http://localhost:30050/auth/login`            |
| Products Service | Routed via API Gateway                              |
| Orders Service   | Routed via API Gateway                              |
| Frontend         | Open [http://localhost:3000](http://localhost:3000) |

---

## 📸 Add Screenshots for Each Step

*(Place here for each major milestone)*

---

## 📦 Built With

* Docker
* Kubernetes
* React
* Node.js (Express)
* http-proxy-middleware

---

## ✍️ Author

**Taiwo Adebiyi** - [GitHub](https://github.com/Prince-Tee)

---