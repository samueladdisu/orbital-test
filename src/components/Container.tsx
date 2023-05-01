import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function Container({ children }: Props) {
  return <section className=" xl:max-w-6xl xl:mx-auto">{children}</section>
}
