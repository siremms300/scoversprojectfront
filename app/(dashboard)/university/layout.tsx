// client/app/%28dashboard%29/university/layout.tsx
export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}







// import { RoleGuard } from '@/components/dashboard/RoleGuard'

// export default function UniversityLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <RoleGuard allowedRoles={['university_admin']}>
//       {children}
//     </RoleGuard>
//   )
// }