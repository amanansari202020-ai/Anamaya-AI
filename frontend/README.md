# HealthSphere AI Frontend

React Native/Expo-based mobile frontend for HealthSphere AI - an AI-powered rural healthcare navigation platform.

## 🚀 Features

- **AI Health Guidance**: Interactive symptom assessment with voice input
- **Healthcare Facility Discovery**: Location-based facility search with maps
- **Smart Referral System**: QR code-based patient referrals
- **Digital Health Passport**: Complete portable health records
- **Offline Mode**: Full offline capability with data sync
- **Government Schemes Matcher**: Find eligible healthcare support schemes
- **Budget Estimator**: Healthcare cost estimation
- **Multilingual Support**: Multiple language support
- **Voice Assistant**: Speak your symptoms naturally
- **Mood-Based UI**: Adaptive interface based on mood selection

## 📋 Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android Studio or XCode (for emulator)
- Python backend running on http://localhost:8000

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env if needed (default localhost:8000 works for development)
```

### 3. Start Development Server

```bash
# Option 1: Start Expo dev server
npm start

# Option 2: For specific platform
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

### 4. Connect to Backend

Ensure the backend is running:

```bash
# In another terminal
cd backend
uvicorn app.main:app --reload --port 8000
```

## 📁 Project Structure

```
frontend/
├── App.tsx                 # Main navigation and app setup
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
│
├── src/
│   ├── screens/           # Screen components
│   │   ├── auth/          # Login/Register screens
│   │   ├── main/          # Dashboard and main screens
│   │   ├── health/        # AI health check and assessment
│   │   ├── facilities/    # Facility search and details
│   │   ├── referral/      # Referral management
│   │   ├── schemes/       # Government schemes
│   │   ├── budget/        # Budget estimation
│   │   ├── journey/       # Healthcare journey
│   │   ├── profile/       # User profile
│   │   ├── settings/      # Settings and offline mode
│   │   └── stubs.tsx      # Screen implementations
│   │
│   ├── components/        # Reusable components
│   │   ├── ConnectionStatusBar.tsx
│   │   ├── SymptomInput.tsx
│   │   ├── FacilityCard.tsx
│   │   └── ReferralCard.tsx
│   │
│   ├── services/          # API and other services
│   │   └── api.ts         # Backend API calls
│   │
│   ├── stores/            # State management (Zustand)
│   │   ├── authStore.ts   # Authentication state
│   │   └── themeStore.ts  # Theme and UI state
│   │
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   │
│   └── utils/             # Utility functions
│       ├── theme.ts       # Theme configuration
│       ├── helpers.ts     # Helper functions
│       └── validators.ts  # Form validators
│
└── assets/               # Images, fonts, icons
```

## 🎨 UI Components

All UI components use `react-native-paper` for Material Design 3 consistency.

### Key Features:
- 🌓 Light/Dark theme toggle
- 📱 Responsive layout for all screen sizes
- ♿ Accessible color contrast ratios
- 🎯 Mood-based interface adaptation

## 🔐 Authentication

### Default Test Credentials

```
Email: user@example.com
Password: password123
```

### Authentication Flow

1. User registers or logs in
2. JWT token stored in AsyncStorage
3. Token added to all API requests
4. Auto-login on app restart if token valid
5. Logout clears token and state

## 🌐 API Integration

All API calls are centralized in `src/services/api.ts`:

```typescript
// Example usage
import * as apiService from "./services/api";

// Assess symptoms
const assessment = await apiService.assessSymptoms({
  symptoms: ["fever", "headache"],
  duration: "2 days",
  severity: "moderate",
});

// Find facilities
const facilities = await apiService.findNearbyFacilities(
  latitude,
  longitude,
  "phc",
  50 // radius in km
);

// Create referral
const referral = await apiService.createReferral({
  referral_reason: "Needs specialist evaluation",
  symptoms: ["chest pain"],
  to_facility_id: 5,
});
```

## 💾 State Management

Using **Zustand** for lightweight state management:

### Auth Store

```typescript
import { useAuthStore } from "./stores/authStore";

// In component
const { user, login, logout, isLoading } = useAuthStore();
```

### Theme Store

```typescript
import { useThemeStore } from "./stores/themeStore";

const { isDarkMode, toggleTheme, setLanguage } = useThemeStore();
```

## 📍 Location Services

The app uses `expo-location` for:
- Finding nearby healthcare facilities
- Displaying facility maps
- Location-based recommendations

### Permissions
- Add in `app.json` or request at runtime
- User must grant location permission for facility search

## 🔄 Offline Functionality

### Offline Features:
- ✅ View downloaded health records
- ✅ Create referrals offline
- ✅ Local symptom assessments
- ✅ Browse government schemes
- ✅ View facility information

### Auto Sync:
- When connectivity returns, app automatically syncs:
  - Pending referrals
  - Updated health records
  - New assessments
  - Conflict resolution for simultaneous updates

### Offline Indicator:
- 🟢 Green: Online
- 🟡 Yellow: Limited connection
- ⚫ Black: Offline mode

## 🎤 Voice Features

### Speech-to-Text
- Input symptoms using voice
- Multi-language speech recognition

### Text-to-Speech
- Read assessments aloud
- Accessibility support
- Healthcare guidance audio

## 🌍 Multilingual Support

Supported languages:
- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Marathi (मराठी)

Translation service in `src/utils/translation.ts`

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Type check
npm run type-check

# Lint
npm run lint
```

## 📦 Building for Production

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

Or use Expo Go for quick testing.

## 🐛 Troubleshooting

### Connection Issues
- Ensure backend is running on port 8000
- Check `.env` file API URL
- Verify network connectivity

### Location Permission Denied
- Grant location permission when prompted
- Check device settings for app permissions

### Blank Screen
- Check console for errors: `npm start` shows logs
- Verify all dependencies installed: `npm install`

### Package Not Found
- Clear cache: `expo r -c`
- Reinstall: `rm -rf node_modules && npm install`

## 🔄 Connecting to Backend

### Environment Setup
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000/api    # Android
EXPO_PUBLIC_API_URL=http://localhost:8000/api    # iOS/Web
```

### For Real Device Testing
```env
EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8000/api
```

Replace `<YOUR_IP>` with your machine's IP address.

## 📚 Key Screens

### 1. Dashboard
- Main hub with quick actions
- Mood selector for UI adaptation
- Connectivity status indicator

### 2. AI Health Check
- Symptom input with voice option
- Common symptoms quick select
- Medical disclaimer

### 3. Find Healthcare
- Location-based facility search
- Filter by facility level/specialty
- Distance calculation
- Opening hours and services

### 4. Health Passport
- Complete health record history
- Organized by record type
- QR code export
- Consent-based sharing

### 5. Government Schemes
- Eligibility assessment
- Scheme details and benefits
- Application process
- Official links

## 🎯 Best Practices

1. **Error Handling**
   - Always wrap API calls in try-catch
   - Show user-friendly error messages
   - Log errors for debugging

2. **Performance**
   - Use React.memo for expensive renders
   - Lazy load screens with React Navigation
   - Optimize list rendering with FlatList

3. **Accessibility**
   - Proper color contrast (WCAG AA)
   - Accessible touch targets (48x48 dp minimum)
   - Screen reader support

4. **Offline Support**
   - Check connectivity before API calls
   - Cache important data locally
   - Sync when connection restored

## 📄 License

Part of the HealthSphere AI hackathon initiative.

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with description

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check backend logs
4. Raise issue on project repository

---

**Next Steps:**
1. ✅ Install dependencies: `npm install`
2. ✅ Start backend: `cd ../backend && uvicorn app.main:app --reload`
3. ✅ Start frontend: `npm start`
4. ✅ Open Android emulator or iOS simulator
5. ✅ Test complete healthcare journey
