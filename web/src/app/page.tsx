export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Tappr
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect instantly with a tap. Share your digital profile through NFC cards and QR codes.
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How it works
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="text-gray-700">Create your digital profile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-gray-700">Tap your phone on an NFC card</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="text-gray-700">Share your profile instantly</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
                      <p className="text-gray-500">
            Visit a profile: <code className="bg-gray-100 px-2 py-1 rounded">/profile/username</code>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Updated with new features - v2.0
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
