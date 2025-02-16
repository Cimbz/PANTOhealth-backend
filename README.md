# PANTOhealth Backend Developer Technical Assessment

Welcome to the **PANTOhealth Backend Developer Technical Assessment**!  
This project is about IoT Data Management System using **NestJS**, **MongoDB**, and **RabbitMQ**.

---

## 1. Installation

### Prerequisites

- **Node.js** (v16 or later)
- **npm** (v7 or later)
- **MongoDB** (running locally or via cloud)
- **RabbitMQ** (running locally or via Docker)

---

### **Install Dependencies**

```bash
# Clone the repository
git clone https://github.com/Cimbz/PANTOhealth-backend.git

# Navigate into the project directory
cd pantohealth-backend

# Install npm dependencies
npm install
```

---

## **2. Environment Configuration**

Create a `.env` file in the root directory with the following variables:

```bash
# RabbitMQ Configuration
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=x-ray

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/pantohealth

# Application Settings
PORT=3000

# Producer Configuration
AUTO_MODE=false
PRODUCER_INTERVAL_MS=60000
```

> **Note:** Update these values based on your environment.

---

## **3. Running the Application**

### **Development Mode**

```bash
npm run start:dev
```

### **Production Mode**

```bash
npm run build
npm run start:prod
```

---

## **4. Accessing the API**

- **Base URL:** `http://localhost:3000`
- **Swagger Documentation:** [API Docs](http://localhost:3000/api/docs)

---

## **5. Testing the Application**

The application does not uses any unit testing (yet!).

---

## **6. RabbitMQ Message Simulation**

### **Manual Data Trigger**

```bash
# Simulate sending x-ray data manually
curl -X GET http://localhost:3000/producer/simulate-xray
```

### **Automatic Data Generation**

To enable continuous data generation:

- Open the **`.env`** file.
- Set:
  ```bash
  AUTO_MODE=true
  PRODUCER_INTERVAL_MS=60000
  ```
- Restart the application.

---

## **87. Technologies Used**

- **Node.js / NestJS** — Backend framework.
- **MongoDB** — Database for x-ray signals.
- **RabbitMQ** — Message queue for x-ray data ingestion.
- **Swagger** — API documentation.
