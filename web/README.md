# Tappr Web App

The web companion to the Tappr mobile app. Displays user profiles when someone taps an NFC card.

## Features

- **Landing Page**: Explains how Tappr works
- **Dynamic Profile Pages**: `/profile/{username}` displays user profiles
- **Firebase Integration**: Shares the same backend as the mobile app
- **Responsive Design**: Works on mobile and desktop

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Firebase** for backend
- **Vercel** for deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase project set up

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## URL Structure

- **Landing Page**: `/`
- **Profile Pages**: `/profile/{username}`

## Development

### Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx        # Landing page
│   │   └── profile/        # Profile pages
│   ├── lib/                # Firebase config
│   ├── services/           # API services
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── package.json
```

### Adding Features

1. **New Pages**: Add to `src/app/`
2. **Components**: Create in `src/components/`
3. **Services**: Add to `src/services/`
4. **Types**: Update `src/types/index.ts`

## Environment Variables

All Firebase config variables must be prefixed with `NEXT_PUBLIC_` to be available in the browser.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Tappr ecosystem.
