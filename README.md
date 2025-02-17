# PANTOhealth Backend Developer Task

This project is a simple IoT Data Management System built with **NestJS**, **MongoDB**, and **RabbitMQ**.

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

### **Manual Data Trigger (Random Generation)**

**Endpoint:**

```http
GET /producer/generate-random-xray
```

**cURL Command:**

```bash
curl -X GET http://localhost:3000/producer/generate-random-xray
```

**Description:**  
Triggers the system to generate random x-ray data and send it to the RabbitMQ queue.

---

### **Manual Data Insertion (Custom Batch)**

**Endpoint:**

```http
POST /producer/send-xray
```

**cURL Command:**

```bash
curl -X POST http://localhost:3000/producer/send-xray \
-H "Content-Type: application/json" \
-d '{
  "66bb584d4ae73e488c30a072": {
    "data": [
      [762, [51.339764, 12.339223833333334, 1.2038000000000002]],
      [1766, [51.33977733333333, 12.339211833333334, 1.531604]],
      [2763, [51.339782, 12.339196166666667, 2.13906]]
    ],
    "time": 1735683480000
  }
}'
```

**Description:**  
Sends a batch of x-ray data directly to the RabbitMQ queue for processing.

**Notes:**

- **Ensure the JSON format is valid.**
- **Each entry follows the format: `[relativeTime, [x, y, speed]]`.**

### **Automatic Data Generation**

To enable continuous data generation:

- Open the **`.env`** file.
- Set:
  ```bash
  AUTO_MODE=true
  PRODUCER_INTERVAL_MS=60000
  ```
- Restart the application.

**Behavior:**

- When **`AUTO_MODE`** is `true`, the producer will automatically generate and send random x-ray data every **60 seconds** (adjustable with `PRODUCER_INTERVAL_MS`).

---

## **7. Technologies Used**

- **Node.js / NestJS** — Backend framework.
- **MongoDB** — Database for x-ray signals.
- **RabbitMQ** — Message queue for x-ray data ingestion.
- **Swagger** — API documentation.
