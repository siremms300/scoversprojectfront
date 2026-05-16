// client/app/%28dashboard%29/investor/layout.tsx
export default function InvestorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}





// import { RoleGuard } from '@/components/dashboard/RoleGuard'

// export default function InvestorLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <RoleGuard allowedRoles={['investor']}>
//       {children}
//     </RoleGuard>
//   )
// }