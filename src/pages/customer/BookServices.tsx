import { Navigate } from 'react-router-dom'

/** Legacy /book route — same shop as /services */
export function BookServices() {
  return <Navigate to="/services" replace />
}

export function BookServiceDetail() {
  return <Navigate to="/services" replace />
}
