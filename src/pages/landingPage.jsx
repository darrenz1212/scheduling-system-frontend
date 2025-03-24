// Outcon UI Mockup - Landing Page Section with Teal and Orange Accent
// Feel: human-centered, fresh, slightly lively with tech recruiting vibe

export default function LandingPage() {
    return (
        <div className="bg-white text-gray-800 min-h-screen p-6">
            {/* Hero Section */}
            <section className="text-center py-20 bg-blue-600 text-white rounded-2xl shadow-xl">
                <h1 className="text-4xl font-bold mb-4">Outcon</h1>
                <p className="text-lg max-w-xl mx-auto">
                    Connecting Southeast Asia's top remote talent with global companies.
                </p>
                <button className="mt-6 bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-xl">
                    Get Started
                </button>
            </section>

            {/* Features Section */}
            <section className="py-16 grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-xl shadow-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">AI-Powered Matching</h2>
                    <p>Smart selection system to match top talent with perfect-fit roles.</p>
                </div>
                <div className="p-6 rounded-xl shadow-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">Legal & Payroll Compliance</h2>
                    <p>We handle contracts and payments across borders so you don’t have to.</p>
                </div>
                <div className="p-6 rounded-xl shadow-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2 text-teal-600">Curated Talent Pool</h2>
                    <p>Only 10% of applicants are accepted, ensuring high quality delivery.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center text-sm text-gray-500 mt-20">
                &copy; 2025 Outcon. All rights reserved.
            </footer>
        </div>
    );
}