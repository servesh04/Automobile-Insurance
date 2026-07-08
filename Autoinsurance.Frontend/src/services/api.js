import axios from "axios";

// ---- one client per service ----
const authClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
  headers: { "Content-Type": "application/json" },
});

const customerClient = axios.create({
  baseURL: import.meta.env.VITE_CUSTOMER_URL,
  headers: { "Content-Type": "application/json" },
});

const vehicleClient = axios.create({
  baseURL: import.meta.env.VITE_VEHICLE_URL,
  headers: { "Content-Type": "application/json" },
});

const policyClient = axios.create({
  baseURL: import.meta.env.VITE_POLICY_URL,
  headers: { "Content-Type": "application/json" },
});

const claimClient = axios.create({
  baseURL: import.meta.env.VITE_CLAIM_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- attach token + handle 401 on every protected client ----
const protectedClients = [customerClient, vehicleClient, policyClient, claimClient];

protectedClients.forEach((client) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );
});

// ---- error message extractor matching your backend's error shapes ----
// your backend returns:
//   ExceptionHandlingMiddleware  → { message: "..." }
//   UseStatusCodePages           → { success: false, message: "..." }
//   DTO validation               → { success: false, message: "Validation failed.", errors: [...] }
//   BadRequest from controller   → { message: "Invalid CustomerId or VehicleId." }
function getErrorMessage(error, fallbackMessage) {
  console.error("API Error Response:", error.response?.data);
  if (error.response?.data?.errors) {
    const errs = error.response.data.errors;
    if (Array.isArray(errs) && errs.length) return errs[0];
    if (typeof errs === 'object') {
      const keys = Object.keys(errs);
      if (keys.length > 0 && Array.isArray(errs[keys[0]])) {
        return errs[keys[0]][0];
      }
    }
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.title) {
    return error.response.data.title;
  }
  if (error.message) {
    return error.message;
  }
  return fallbackMessage;
}

// =================================================================
// AUTH  (https://localhost:7001)
// =================================================================

export async function loginApi(credentials) {
  try {
    const response = await authClient.post("/api/Auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Login failed."));
  }
}

export async function registerApi(userData) {
  try {
    const response = await authClient.post("/api/Auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Registration failed."));
  }
}

export async function forgotPasswordApi(email) {
  try {
    const response = await authClient.post("/api/Auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to send reset link."));
  }
}

export async function resetPasswordApi(data) {
  try {
    const response = await authClient.post("/api/Auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to reset password."));
  }
}

// =================================================================
// CUSTOMERS  (https://localhost:7002)
// =================================================================

export async function getCustomers() {
  try {
    const response = await customerClient.get("/api/Customers");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch customers."));
  }
}

export async function getCustomerById(id) {
  try {
    const response = await customerClient.get(`/api/Customers/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch customer."));
  }
}

export async function getMyProfile() {
  try {
    const response = await customerClient.get("/api/Customers/my-profile");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my profile."));
  }
}

export async function createCustomer(customerData) {
  try {
    const response = await customerClient.post("/api/Customers", customerData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create customer."));
  }
}

export async function updateCustomer(id, customerData) {
  try {
    await customerClient.put(`/api/Customers/${id}`, customerData);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update customer."));
  }
}

export async function deleteCustomer(id) {
  try {
    await customerClient.delete(`/api/Customers/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete customer."));
  }
}

// =================================================================
// VEHICLES  (https://localhost:7003)
// =================================================================

export async function getVehicles() {
  try {
    const response = await vehicleClient.get("/api/Vehicles");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch vehicles."));
  }
}

export async function getVehicleById(id) {
  try {
    const response = await vehicleClient.get(`/api/Vehicles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch vehicle."));
  }
}

export async function createVehicle(vehicleData) {
  try {
    const response = await vehicleClient.post("/api/Vehicles", vehicleData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create vehicle."));
  }
}

export async function updateVehicle(id, vehicleData) {
  try {
    await vehicleClient.put(`/api/Vehicles/${id}`, vehicleData);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update vehicle."));
  }
}

export async function deleteVehicle(id) {
  try {
    await vehicleClient.delete(`/api/Vehicles/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete vehicle."));
  }
}

// =================================================================
// POLICIES  (https://localhost:7004)
// =================================================================

export async function getPolicies() {
  try {
    const response = await policyClient.get("/api/Policies");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch policies."));
  }
}

export async function getPolicyById(id) {
  try {
    const response = await policyClient.get(`/api/Policies/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch policy."));
  }
}

export async function getMyPolicies() {
  try {
    const response = await policyClient.get("/api/Policies/my-policies");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch my policies."));
  }
}

export async function createPolicy(policyData) {
  try {
    const response = await policyClient.post("/api/Policies", policyData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to create policy."));
  }
}

export async function updatePolicy(id, policyData) {
  try {
    await policyClient.put(`/api/Policies/${id}`, policyData);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update policy."));
  }
}

export async function updatePolicyStatus(id, statusData) {
  try {
    await policyClient.put(`/api/Policies/${id}/status`, statusData);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update policy status."));
  }
}

export async function deletePolicy(id) {
  try {
    await policyClient.delete(`/api/Policies/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete policy."));
  }
}

export async function generateQuote(id, premiumAmount) {
  try {
    await policyClient.put(`/api/Policies/${id}/quote`, { premiumAmount });
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to generate quote."));
  }
}

export async function payPremium(id) {
  try {
    await policyClient.put(`/api/Policies/${id}/pay`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to pay premium."));
  }
}

export async function uploadPolicyDocument(id, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await policyClient.post(`/api/Policies/${id}/upload-document`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to upload document."));
  }
}

// =================================================================
// CLAIMS  (https://localhost:7005)
// =================================================================

export async function getClaims() {
  try {
    const response = await claimClient.get("/api/Claims");
    return response.data;
  } catch (error) {
    console.error("Error fetching claims:", error);
    throw error;
  }
}

export async function getMyClaims() {
  try {
    const response = await claimClient.get("/api/Claims/my-claims");
    return response.data;
  } catch (error) {
    console.error("Error fetching my claims:", error);
    throw error;
  }
}

export async function getClaimById(id) {
  try {
    const response = await claimClient.get(`/api/Claims/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to fetch claim."));
  }
}

export async function createClaim(claimData) {
  try {
    const response = await claimClient.post("/api/Claims", claimData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to file claim."));
  }
}

export async function updateClaimStatus(id, statusData) {
  try {
    await claimClient.put(`/api/Claims/${id}/status`, statusData);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to update claim status."));
  }
}

export async function deleteClaim(id) {
  try {
    await claimClient.delete(`/api/Claims/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete claim."));
  }
}