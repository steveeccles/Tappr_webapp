export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-pink-600">TAPPR</h1>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-700 hover:text-pink-600 px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </button>
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Digital Dating Card,
            <span className="text-pink-600"> One Tap Away</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Share your dating profile instantly with NFC cards. No apps to download, 
            no awkward exchanges. Just tap and connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold">
              Order Your Cards
            </button>
            <button className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold">
              View Demo Profile
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Tappr Works
            </h2>
            <p className="text-xl text-gray-600">
              Modern dating made simple and authentic
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Build your digital dating profile with photos, bio, and date ideas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎴</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Cards</h3>
              <p className="text-gray-600">
                Receive beautiful NFC cards linked to your profile.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💕</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tap & Connect</h3>
              <p className="text-gray-600">
                Share your profile instantly with a simple tap. Start conversations naturally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-pink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Dating Life?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands who are already making authentic connections with Tappr.
          </p>
          <button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold">
            Get Your Tappr Cards - £12.99/month
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Tappr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 