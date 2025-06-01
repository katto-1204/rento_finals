export const COLORS = {

  success: "#00bb02",
  error: "#ff4444",
  warning: "#ffa500",
  info: "#17a2b8",
  light: "#f8f9fa",
  dark: "#343a40",


  background: "#ededed",
  primary: "#1054CF",
  secondary: "#FFB700",
  white: "#ffffff",
  black: "#000000",

  lightGray: "#e0e0e0",
  gray: {
    100: "#f8f9fa",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
}

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
}

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
}

export const CAR_BRANDS = [
  "BMW",
  "Mercedes",
  "Audi",
  "Toyota",
  "Honda",
  "Nissan",
  "Ford",
  "Hyundai",
  "Volkswagen",
  "Mazda",
]

export const CAR_TYPES = ["sedan", "suv", "hatchback", "coupe", "convertible", "truck", "van"]

export const FUEL_TYPES = ["gasoline", "diesel", "hybrid", "electric"]

export const TRANSMISSION_TYPES = ["manual", "automatic", "cvt"]

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
}

export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_REMINDER: "booking_reminder",
  PAYMENT_SUCCESSFUL: "payment_successful",
  PAYMENT_FAILED: "payment_failed",
  CAR_RETURNED: "car_returned",
  REVIEW_REQUEST: "review_request",
  PROMOTION: "promotion",
  SYSTEM_UPDATE: "system_update",
  EMERGENCY: "emergency",
}

export const API_ENDPOINTS = {
  USERS: "/api/users",
  CARS: "/api/cars",
  BOOKINGS: "/api/bookings",
  NOTIFICATIONS: "/api/notifications",
  REVIEWS: "/api/reviews",
  PAYMENTS: "/api/payments",
}

export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_PREFERENCES: "user_preferences",
  SEARCH_HISTORY: "search_history",
  RECENT_SEARCHES: "recent_searches",
}
