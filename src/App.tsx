import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { CustomerLogin } from './pages/customer/CustomerLogin'
import { BookServices, BookServiceDetail } from './pages/customer/BookServices'
import { CartPage } from './pages/customer/CartPage'
import { CheckoutPage } from './pages/customer/CheckoutPage'
import { Blog } from './pages/Blog'
import { Contact } from './pages/Contact'
import { Faq } from './pages/Faq'
import { Home } from './pages/Home'
import { Inspiration } from './pages/Inspiration'
import { Reels } from './pages/Reels'
import { Services } from './pages/Services'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLeads } from './pages/admin/AdminLeads'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminModuleStub } from './pages/admin/AdminModuleStub'
import { AdminNotifications } from './pages/admin/AdminNotifications'
import { AdminVerification } from './pages/admin/AdminVerification'
import { VendorBank } from './pages/vendor/VendorBank'
import { VendorCredentials } from './pages/vendor/VendorCredentials'
import { VendorDashboard } from './pages/vendor/VendorDashboard'
import { VendorJoin } from './pages/vendor/VendorJoin'
import { VendorLogin } from './pages/vendor/VendorLogin'
import { VendorRegister } from './pages/vendor/VendorRegister'
import { VendorStatus } from './pages/vendor/VendorStatus'
import { VendorDetail } from './pages/VendorDetail'
import { Vendors } from './pages/Vendors'
import { Venues } from './pages/Venues'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="vendor/login" element={<VendorLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="partners" element={<AdminVerification />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route
            path="customers"
            element={
              <AdminModuleStub title="Customers" blurb="Customer list, booking history, flags and complaints." />
            }
          />
          <Route
            path="bookings"
            element={
              <AdminModuleStub
                title="Bookings"
                blurb="Confirmed bookings, advances, invoices and status through the job lifecycle."
              />
            }
          />
          <Route
            path="services"
            element={
              <AdminModuleStub
                title="Services & Packages"
                blurb="Manage service categories, packages and pricing shown to customers."
              />
            }
          />
          <Route
            path="assignment"
            element={
              <AdminModuleStub
                title="Assignment"
                blurb="Match location, date and category — assign the best partner by rating and availability."
              />
            }
          />
          <Route
            path="operations"
            element={
              <AdminModuleStub
                title="Operations"
                blurb="Event-day monitoring, partner arrival, service start and completion updates."
              />
            }
          />
          <Route
            path="media-qc"
            element={
              <AdminModuleStub
                title="Media & QC"
                blurb="QC checklist, approve or rework, editing assignment and final QC before delivery."
              />
            }
          />
          <Route
            path="payments"
            element={
              <AdminModuleStub
                title="Payments & Payouts"
                blurb="Customer payments, refunds, partner payouts, commission and Wedyora margin."
              />
            }
          />
          <Route
            path="support"
            element={
              <AdminModuleStub
                title="Support & Complaints"
                blurb="Ticket inbox, priority, SLA timers and resolution notes."
              />
            }
          />
          <Route
            path="marketing"
            element={
              <AdminModuleStub
                title="Marketing & Offers"
                blurb="Coupons, offers, push notifications and banner campaigns."
              />
            }
          />
          <Route
            path="reports"
            element={
              <AdminModuleStub
                title="Reports"
                blurb="Sales, booking, finance, partner, customer and performance analytics."
              />
            }
          />
          <Route path="cms" element={<AdminModuleStub title="CMS" blurb="Website content, banners and pages." />} />
          <Route
            path="staff"
            element={<AdminModuleStub title="Staff & Roles" blurb="Admin users, roles and access permissions." />}
          />
          <Route
            path="settings"
            element={<AdminModuleStub title="Settings" blurb="Platform settings, policies and integrations." />}
          />
          <Route
            path="audit"
            element={<AdminModuleStub title="Audit Logs" blurb="Who changed what — verification, payouts and access." />}
          />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="verification" element={<Navigate to="/admin/partners" replace />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendor/join" element={<VendorJoin />} />
          <Route path="vendor/register" element={<VendorRegister />} />
          <Route path="vendor/credentials" element={<VendorCredentials />} />
          <Route path="vendor/status" element={<VendorStatus />} />
          <Route path="vendor/bank" element={<VendorBank />} />
          <Route path="vendor/dashboard" element={<VendorDashboard />} />
          <Route path="vendor/:id" element={<VendorDetail />} />
          <Route path="venues" element={<Venues />} />
          <Route path="reels" element={<Reels />} />
          <Route path="inspiration" element={<Inspiration />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<Faq />} />
          <Route path="login" element={<CustomerLogin />} />
          <Route path="book" element={<BookServices />} />
          <Route path="book/:serviceId" element={<BookServiceDetail />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="become-vendor" element={<Navigate to="/vendor/join" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
