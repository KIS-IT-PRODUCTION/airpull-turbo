import Sidebar from '@/components/admin/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export const metadata = {
  title: 'Admin Panel | Управління магазином',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

try {
  const decoded: any = jwtDecode(token);
  console.log('--- DEBUG ADMIN CHECK ---');
  console.log('Decoded Token:', decoded); // Подивись у термінал!
  console.log('Role found:', decoded.role);
  
  if (decoded.role !== 'ADMIN' && decoded.role !== 'admin') {
    console.log('Access Denied: Role mismatch');
    redirect('/');
  }
} catch (error) {
  console.error('JWT Decode Error:', error);
  redirect('/login');
}

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}