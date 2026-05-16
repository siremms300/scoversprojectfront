// client/app/%28dashboard%29/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}










// import { RoleGuard } from '@/components/dashboard/RoleGuard'

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <RoleGuard allowedRoles={['admin', 'super_admin']}>
//       {children}
//     </RoleGuard>
//   )
// }