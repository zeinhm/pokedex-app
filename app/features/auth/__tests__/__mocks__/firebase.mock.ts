import { vi } from "vitest";

// Mock Firebase Auth
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
};

// Mock Firebase Auth functions
export const mockSignInWithEmailAndPassword = vi.fn();
export const mockCreateUserWithEmailAndPassword = vi.fn();
export const mockSignOut = vi.fn();
export const mockUpdateProfile = vi.fn();
export const mockSendEmailVerification = vi.fn();
export const mockOnAuthStateChanged = vi.fn();

// Mock Firebase User
export const createMockFirebaseUser = (overrides = {}) => ({
  uid: "test-uid-123",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "https://example.com/photo.jpg",
  emailVerified: true,
  phoneNumber: null,
  isAnonymous: false,
  providerId: "firebase",
  metadata: {
    creationTime: "2023-01-01T00:00:00.000Z",
    lastSignInTime: "2023-01-02T00:00:00.000Z",
  },
  providerData: [],
  refreshToken: "mock-refresh-token",
  tenantId: null,
  delete: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue("mock-id-token"),
  getIdTokenResult: vi.fn().mockResolvedValue({
    token: "mock-id-token",
    authTime: "2023-01-02T00:00:00.000Z",
    issuedAtTime: "2023-01-02T00:00:00.000Z",
    expirationTime: "2023-01-02T01:00:00.000Z",
    signInProvider: "password",
    signInSecondFactor: null,
    claims: {},
  }),
  reload: vi.fn(),
  toJSON: vi.fn().mockReturnValue({}),
  ...overrides,
});

// Mock UserCredential
export const createMockUserCredential = (user = createMockFirebaseUser()) => ({
  user,
  providerId: "password",
  operationType: "signIn" as const,
});

// Mock Firebase Auth errors
export const createFirebaseAuthError = (code: string) => {
  const error = new Error(`Firebase Auth Error: ${code}`);
  (error as any).code = code;
  return error;
};

// Reset all mocks
export const resetAuthMocks = () => {
  mockSignInWithEmailAndPassword.mockReset();
  mockCreateUserWithEmailAndPassword.mockReset();
  mockSignOut.mockReset();
  mockUpdateProfile.mockReset();
  mockSendEmailVerification.mockReset();
  mockOnAuthStateChanged.mockReset();
  mockAuth.currentUser = null;
};
