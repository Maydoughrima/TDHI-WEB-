export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgshade">
      <div className="bg-bg p-6 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-heading text-red-600 mb-2">
          Access Denied
        </h1>
        <p className="text-sm text-gray-600">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
}
