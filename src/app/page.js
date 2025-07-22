import Link from "next/link";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <div className="text-center">
            <span className="text-6xl md:text-8xl mb-6 block">🏠</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
              RoomieRules
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
              Complete Tenancy Management for Landlords & Property Developers
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Streamline your property management with our comprehensive platform. 
              Manage properties, invite tenants, handle documents, and maintain 
              complete control over your rental portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Managing Properties
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Manage Your Properties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From property listing to tenant management, we've got you covered with 
              powerful tools designed specifically for landlords and property developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Property Management */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Property Management</h3>
              <p className="text-gray-600 mb-6">
                Add, edit, and manage all your properties with detailed information, 
                photos, and documents. Keep everything organized in one place.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• UK address fields with postcode validation</li>
                <li>• Property type and room specifications</li>
                <li>• Document upload and storage</li>
                <li>• Card and list view options</li>
              </ul>
            </Card>

            {/* Tenant Management */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tenant Management</h3>
              <p className="text-gray-600 mb-6">
                Invite tenants with secure email links, manage assignments, 
                and keep track of all tenant relationships across your portfolio.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Secure email invitation system</li>
                <li>• Tenant assignment and removal</li>
                <li>• Invitation status tracking</li>
                <li>• Bulk tenant management</li>
              </ul>
            </Card>

            {/* Multi-Tenancy */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multi-Tenancy</h3>
              <p className="text-gray-600 mb-6">
                Built for property developers and landlords with multiple properties. 
                Each property is isolated with its own tenants and management.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Property-specific tenant isolation</li>
                <li>• Role-based access control</li>
                <li>• Admin oversight capabilities</li>
                <li>• Scalable architecture</li>
              </ul>
            </Card>

            {/* Document Management */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Document Management</h3>
              <p className="text-gray-600 mb-6">
                Upload and store property documents, contracts, and important files. 
                Keep everything organized and easily accessible.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Secure document storage</li>
                <li>• Property-specific organization</li>
                <li>• File type and size tracking</li>
                <li>• Easy document retrieval</li>
              </ul>
            </Card>

            {/* Admin Tools */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Tools</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive admin panel for managing users, roles, and system-wide 
                settings. Perfect for property management companies.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• User role management</li>
                <li>• System-wide property access</li>
                <li>• User promotion and demotion</li>
                <li>• Complete user oversight</li>
              </ul>
            </Card>

            {/* Modern Interface */}
            <Card className="text-center p-8">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Modern Interface</h3>
              <p className="text-gray-600 mb-6">
                Beautiful, responsive design that works on all devices. 
                Intuitive navigation and user-friendly interface.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Mobile-responsive design</li>
                <li>• Card and list view options</li>
                <li>• Intuitive navigation</li>
                <li>• Modern UI components</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Property Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join landlords and property developers who are already using RoomieRules 
            to streamline their operations and improve tenant relationships.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-3xl">🏠</span>
              <h3 className="text-2xl font-bold">RoomieRules</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Complete tenancy management for landlords and property developers
            </p>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} RoomieRules. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
