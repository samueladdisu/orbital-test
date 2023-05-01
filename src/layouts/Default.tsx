import { ReactNode } from "react"
import Navbar from "../components/Navbar"

type Props = {
  children: ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default MainLayout
