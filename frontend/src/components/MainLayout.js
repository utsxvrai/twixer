import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-200 dark:bg-gray-900">
      {/* Left Sidebar */}
      <aside className="w-[300px] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Feed - take all space between sidebars, centered content */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-4">
          {children}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[550px] flex-shrink-0 hidden lg:block">
        <RightSidebar />
      </aside>
    </div>
  );
}
