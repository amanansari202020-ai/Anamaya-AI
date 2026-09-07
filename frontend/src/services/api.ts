// API Service
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

let authToken: string | null = null;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Auth endpoints
export const register = async (data: any) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return response.data;
};

// Patient profile
export const getPatientProfile = async () => {
  const response = await apiClient.get("/patient/profile");
  return response.data;
};

export const updatePatientProfile = async (data: any) => {
  const response = await apiClient.put("/patient/profile", data);
  return response.data;
};

// Health assessment
export const assessSymptoms = async (data: any) => {
  const response = await apiClient.post("/health/assess", data);
  return response.data;
};

export const getAssessment = async (assessmentId: number) => {
  const response = await apiClient.get(`/health/assessment/${assessmentId}`);
  return response.data;
};

// Healthcare journey
export const getHealthcareJourney = async (assessmentId: number) => {
  const response = await apiClient.get(`/journey/${assessmentId}`);
  return response.data;
};

// Facilities
export const findNearbyFacilities = async (
  latitude: number,
  longitude: number,
  facilityLevel?: string,
  radiusKm?: number
) => {
  const response = await apiClient.get("/facilities/nearby", {
    params: {
      latitude,
      longitude,
      facility_level: facilityLevel,
      radius_km: radiusKm || 50,
    },
  });
  return response.data;
};

export const getFacilityDetails = async (facilityId: number) => {
  const response = await apiClient.get(`/facilities/${facilityId}`);
  return response.data;
};

export const findNearbyFacilitiesWithDoctors = async (
  latitude: number,
  longitude: number,
  radiusKm?: number
) => {
  const response = await apiClient.get("/facilities/nearby-with-doctors", {
    params: {
      latitude,
      longitude,
      radius_km: radiusKm || 25,
    },
  });
  return response.data;
};

export const requestAppointment = async (data: any) => {
  const response = await apiClient.post("/appointments/request", data);
  return response.data;
};

export const getPatientAppointments = async (patientId: number) => {
  const response = await apiClient.get(`/appointments/${patientId}`);
  return response.data;
};

// Referral
export const createReferral = async (data: any) => {
  const response = await apiClient.post("/referral/create", data);
  return response.data;
};

export const getReferral = async (referralId: string) => {
  const response = await apiClient.get(`/referral/${referralId}`);
  return response.data;
};

export const updateReferral = async (referralId: string, data: any) => {
  const response = await apiClient.put(`/referral/${referralId}`, data);
  return response.data;
};

// Digital health passport
export const getHealthPassport = async () => {
  const response = await apiClient.get("/health-passport");
  return response.data;
};

export const addHealthRecord = async (data: any) => {
  const response = await apiClient.post("/health-passport/record", data);
  return response.data;
};

export const exportHealthPassportQR = async () => {
  const response = await apiClient.get("/health-passport/export-qr");
  return response.data;
};

// Government schemes
export const matchSchemes = async (data: any) => {
  const response = await apiClient.post("/schemes/match", data);
  return response.data;
};

export const getScheme = async (schemeId: number) => {
  const response = await apiClient.get(`/schemes/${schemeId}`);
  return response.data;
};

// Budget estimation
export const estimateBudget = async (data: any) => {
  const response = await apiClient.post("/budget/estimate", data);
  return response.data;
};

// Offline sync
export const syncPendingData = async () => {
  const response = await apiClient.post("/sync/pending", {});
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};
