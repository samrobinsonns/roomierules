export default function PageWrapper({ children }) {
  return (
    <div className="bg-gradient-to-br from-primary-light via-background to-accent-blue min-h-screen">
      <div className="max-w-[95%] mx-auto w-full px-2 sm:px-4 lg:px-6 py-8 min-h-[calc(100vh-64px)]">
        {children}
      </div>
    </div>
  );
} 