# Automobile Insurance System: Demo Script & Technical Workflow

This document provides a comprehensive overview of the Automobile Insurance System's architecture and codebase, along with a step-by-step script for presenting a demo.

---

## 1. Technical Explanation: Frontend Architecture

The frontend is built using **React** with **Vite**, utilizing **React Router** for navigation and **Context API** for global state management (Authentication). 

### Directory Structure & File Roles:
*   `src/App.jsx` & `src/main.jsx`: The entry points of the React application. `App.jsx` defines the routing logic and protects routes based on user roles (Customer vs. Agent/Admin).
*   `src/context/AuthContext.jsx`: Manages the authentication state globally. It stores the JWT token, parses the user's role and details, and provides `login` and `logout` functions to the rest of the application.
*   `src/services/api.js`: Contains all the Axios clients for interacting with the backend. It dynamically routes requests to the correct microservice ports (e.g., Auth on 7001, Policy on 7004) and automatically attaches the JWT Bearer token to outgoing requests.

### Pages:
*   **Public Pages (`src/pages/public/`)**:
    *   `Home.jsx`: The landing page with a modern, engaging UI.
    *   `Login.jsx` & `Register.jsx`: Handles user authentication and account creation.
*   **Customer Pages (`src/pages/customer/`)**:
    *   `MyPolicy.jsx`: Dashboard for customers to view their active and pending policies.
    *   `NewPolicy.jsx`: The multi-step wizard where customers register their vehicle and submit a policy proposal.
    *   `PayPremium.jsx`: The UI for simulating the payment process for a quoted policy.
    *   `MyClaims.jsx` & `FileClaim.jsx`: Allows customers to view their claim history and file a new claim against an active policy.
*   **Agent/Officer Pages (`src/pages/officer/`)**:
    *   `Dashboard.jsx`: A high-level overview for agents, showing statistics (Total Policies, Pending Claims, etc.).
    *   `Policies.jsx` & `PolicyDetail.jsx`: Tables and detailed views for agents to review, quote, and approve/reject policies.
    *   `Claims.jsx` & `ClaimDetail.jsx`: Allows agents to process, approve, or reject customer claims.
    *   `Customers.jsx` & `Vehicles.jsx`: Administrative views to manage raw customer and vehicle data.

### Shared Components (`src/components/`):
*   `layouts/`: Contains `CustomerLayout` and `OfficerLayout` which provide the sidebars and navigation menus specific to the user's role.
*   `shared/`: Reusable components like `StatusBadge` (for consistent status coloring) and `ConfirmModal` (for destructive or important actions).

---

## 2. Technical Explanation: Backend Microservices

The backend utilizes a **Microservices Architecture** built with **ASP.NET Core Web API** and **Entity Framework Core (SQL Server)**. The system is split into distinct, decoupled services.

### Auth Service (Port 7001)
Manages user identities and issues JSON Web Tokens (JWTs).
*   `POST /api/Auth/register`: Creates a new user and assigns them the "Customer" role.
*   `POST /api/Auth/login`: Validates credentials and returns a JWT containing the user's claims and roles.

### Customer Service (Port 7002)
Manages customer profiles and personal information.
*   `GET /api/Customers` & `GET /api/Customers/{id}`: Retrieves customer details.
*   `POST /api/Customers`: Creates a customer profile (typically triggered during the policy creation workflow).

### Vehicle Service (Port 7003)
Manages vehicle data.
*   `GET /api/Vehicles` & `GET /api/Vehicles/{id}`: Retrieves vehicle details.
*   `POST /api/Vehicles`: Registers a new vehicle into the system.

### Policy Service (Port 7004)
The core business logic engine for managing insurance policies.
*   `GET /api/Policies`: (Agent) Gets all policies in the system.
*   `GET /api/Policies/my-policies`: (Customer) Gets policies owned by the logged-in user.
*   `GET /api/Policies/{id}`: Gets details of a specific policy.
*   `POST /api/Policies`: Submits a new policy proposal.
*   `PUT /api/Policies/{id}/quote`: (Agent) Generates a premium quote for a proposed policy.
*   `PUT /api/Policies/{id}/pay`: (Customer) Simulates premium payment and activates the policy.
*   `POST /api/Policies/{id}/upload-document`: Handles image file uploads for policy verification.

### Claim Service (Port 7005)
Handles the filing and processing of insurance claims.
*   `GET /api/Claims`: (Agent) Gets all claims.
*   `GET /api/Claims/my-claims`: (Customer) Gets claims filed by the logged-in user.
*   `GET /api/Claims/{id}`: Gets details of a specific claim.
*   `POST /api/Claims`: Files a new claim (validates that the policy is Active).
*   `PUT /api/Claims/{id}/status`: (Agent) Approves or rejects a claim.

*(Note: The microservices communicate with each other synchronously via HTTP Clients—for example, ClaimService calls PolicyService to verify a policy is active before allowing a claim).*

---

## 3. The Demo Script: Step-by-Step

Use this script to guide your presentation. It is designed to show the full lifecycle of the system from both the Customer and Agent perspectives.

### Phase 1: Introduction & Architecture (2 mins)
**What to say:**
> "Welcome to the Automobile Insurance System demonstration. This application is built using a modern tech stack: a React frontend communicating with an ASP.NET Core backend utilizing a Microservices architecture. We've broken down the domain into specialized services: Auth, Customer, Vehicle, Policy, and Claim. This ensures scalability and separation of concerns. Today, I'll walk you through the core business workflow from both the customer's and the insurance agent's perspectives."

### Phase 2: The Customer Experience - Registration & Proposal (3 mins)
**What to do:**
1.  Navigate to the public homepage.
2.  Click **Register** and create a new customer account (e.g., `johndoe`, `Password@123`).
3.  Once logged in, point out the empty Dashboard (My Policies).
4.  Click **Get New Policy**.
5.  Fill out the multi-step form:
    *   **Step 1:** Enter customer details (Name, DOB, License, Address).
    *   **Step 2:** Enter vehicle details (Make, Model, VIN, Year).
    *   **Step 3:** Select a Coverage Type (e.g., Comprehensive) and submit.
6.  Show that the policy now appears on the dashboard with a status of `ProposalSubmitted`.

**What to say:**
> "As a new customer, the first step is to apply for a policy. Our multi-step wizard orchestrates calls to multiple microservices in the background. It registers the customer in the Customer Service, registers the vehicle in the Vehicle Service, and finally submits a proposal to the Policy Service. The policy is currently pending review by an agent."

### Phase 3: The Agent Experience - Underwriting (3 mins)
**What to do:**
1.  Open an Incognito window or log out, and log in as an **Agent** (e.g., `agent`, `Agent@123`).
2.  Navigate to the **Agent Dashboard**. Point out the statistics and recent activity widgets.
3.  Click on the **Policies** tab. Find the policy `johndoe` just submitted (status: `ProposalSubmitted`).
4.  Click **View** to open the Policy Detail page.
5.  In the yellow action bar, enter a Premium Amount (e.g., `15000`) and click **Generate Quote**.
6.  Show that the status changes to `QuoteGenerated`.

**What to say:**
> "Switching hats, I am now logged in as an Insurance Agent. The Agent Dashboard provides a bird's-eye view of the system. I can see the new policy proposal submitted by our customer. After reviewing the vehicle and customer details, I can underwrite the policy by generating a quote. Once I set the premium amount, the policy status updates and awaits customer payment."

### Phase 4: Customer Payment & Policy Activation (2 mins)
**What to do:**
1.  Switch back to the **Customer** window.
2.  Refresh the Dashboard. Point out that the policy status is now `QuoteGenerated` and the premium amount is displayed.
3.  Click on the policy to view details, then click **Pay Premium**.
4.  A success message will appear, and the status changes to `Active`.

**What to say:**
> "Back on the customer side, we can see the agent has provided a quote. The customer can now proceed to pay the premium. Once the payment is processed, the Policy Service updates the status to 'Active'. The customer is now fully insured."

### Phase 5: Filing and Processing a Claim (4 mins)
**What to do:**
1.  As the **Customer**, navigate to the **Claims** tab.
2.  Click **File a Claim**.
3.  Select the newly activated policy from the dropdown. Enter an incident date, amount (e.g., `5000`), and a description. Click Submit.
4.  Show the claim in the customer's list with a status of `Pending`.
5.  Switch back to the **Agent** window.
6.  Navigate to the **Claims** tab. Find the new pending claim and click **View**.
7.  Review the claim details, then click **Approve Claim**.
8.  Show that the status updates to `Approved` and the Resolved Date is populated.

**What to say:**
> "Unfortunately, accidents happen. Let's see how our system handles claims. The customer easily files a claim against their active policy. The Claim Service automatically validates against the Policy Service to ensure the policy is valid and active. 
> 
> Switching back to the Agent, they are immediately notified of the pending claim. The agent can review the incident description and amount. With a single click, the agent approves the claim, finalizing the workflow.
> 
> This completes the core lifecycle of our Automobile Insurance System—from onboarding and underwriting to policy management and claim resolution, all powered by a robust, secure microservices backend."
