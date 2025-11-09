# Quick Start Guide

This guide will help you get Autistas up and running in minutes!

## Step 1: Test the Backend (without database)

The backend can run without a database connection initially. Let's test the health endpoint:

```bash
cd backend
pnpm run dev
```

In another terminal, test the health endpoint:
```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "autistas-backend",
  "version": "0.1.0"
}
```

Press `Ctrl+C` to stop the server.

## Step 2: Start Backend with Docker (includes database)

```bash
# From the root directory
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f backend
```

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

## Step 3: Run the Mobile App

Open a new terminal:

```bash
cd mobile
pnpm start
```

This will start the Expo dev server. You'll see a QR code and options:

- **iOS Simulator**: Press `i` (requires Xcode on macOS)
- **Android Emulator**: Press `a` (requires Android Studio)
- **Physical Device**:
  1. Install "Expo Go" from App Store or Play Store
  2. Scan the QR code with your camera (iOS) or Expo Go app (Android)

## Step 4: Test the App

1. The app should open showing a welcome message
2. Try typing a message in the chat input at the bottom
3. Press send - you'll get a placeholder response
4. Try switching your phone to dark mode to see the theme change

## What's Working Now

✅ Mobile app with theme switching
✅ Chat UI (frontend only)
✅ Backend API with health check
✅ Docker setup with PostgreSQL
✅ CI/CD pipeline configuration

## What's Next

🔧 **Connect Your LLM**:
1. Update `backend/.env` with your LLM API URL
2. Implement the LLM call in `backend/src/routes/chat.ts`
3. Connect the mobile app to make real API calls

🚀 **Build for Testing**:
```bash
# Install EAS CLI globally
pnpm add -g eas-cli

# Login to Expo
eas login

# Build for Android
cd mobile
eas build --platform android --profile preview

# Build for iOS (on macOS)
eas build --platform ios --profile preview
```

## Troubleshooting

### Backend won't start
- Make sure port 3000 is not in use: `lsof -i :3000`
- Check Docker is running: `docker ps`

### Mobile app won't connect to backend
- On Android emulator, use `http://10.0.2.2:3000` instead of `localhost:3000`
- On iOS simulator, `localhost:3000` works
- On physical device, use your computer's local IP (e.g., `http://192.168.1.100:3000`)
- Update `mobile/src/config/api.ts` accordingly

### Docker issues
- Make sure Docker Desktop is running
- Try: `docker-compose down && docker-compose up -d`

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.

Happy coding! 🚀
