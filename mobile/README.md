# Autistas Mobile App

React Native mobile application built with Expo.

## Prerequisites

- Node.js 18+ and pnpm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac only) or Android Emulator
- [EAS CLI](https://docs.expo.dev/build/setup/) for production builds

## Environment Setup

### Required Environment Variables

The app requires the `EXPO_PUBLIC_API_URL` environment variable to be set.

#### For Local Development

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your backend API URL:

   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

   **Platform-specific URLs:**
   - **iOS Simulator**: `http://localhost:3000`
   - **Android Emulator**: `http://10.0.2.2:3000`
   - **Physical Device**: Use your computer's IP on local network (e.g., `http://192.168.1.100:3000`)

#### For Production Builds

**REQUIRED**: Set the API URL via EAS Secrets before building:

```bash
eas env:create --scope project --name EXPO_PUBLIC_API_URL --value https://api.yourdomain.com
```

Or configure it in the [Expo dashboard](https://expo.dev/) under your project's Secrets section.

> **Note**: Production builds will fail without this secret set, as there are no hardcoded fallbacks for security reasons.

## Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Start on specific platform
pnpm ios       # iOS Simulator
pnpm android   # Android Emulator
pnpm web       # Web browser
```

## Development

### Running the App

```bash
# Start Expo dev server
pnpm start
```

Then:

- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for web browser
- Scan QR code with Expo Go app on physical device

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Building for Production

### Prerequisites

1. Install EAS CLI:

   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:

   ```bash
   eas login
   ```

3. Set up your own EAS project:
   - Update `extra.eas.projectId` in `app.config.js` with your EAS project ID
   - Or remove it and run `eas build:configure` to create a new project

4. Configure secrets:
   ```bash
   eas env:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-api-url.com
   ```

### Build Commands

```bash
# Build for development (includes dev client)
eas build --profile development

# Build for internal testing
eas build --profile preview

# Build for production
eas build --profile production
```

## Project Structure

```
mobile/
├── src/
│   ├── api/           # API client and services
│   ├── components/    # React components
│   ├── config/        # Configuration files
│   ├── contexts/      # React contexts
│   ├── screens/       # Screen components
│   └── types/         # TypeScript type definitions
├── app.config.js      # Expo configuration (dynamic)
├── eas.json          # EAS Build configuration
└── package.json      # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Set up your local environment variables
4. Make your changes
5. Run linting and formatting
6. Submit a pull request

## License

Unlicense - see [LICENSE](../LICENSE) file for details.
