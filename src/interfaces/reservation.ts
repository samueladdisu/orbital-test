export interface AgentOption {
  name: string
  image: string
}

export interface Reservation {
  id: number
  name: string
  email: string
  roomNumber: number
  checkin: string
  checkout: string
  price: string
  status: string
  agent: AgentOption
}
