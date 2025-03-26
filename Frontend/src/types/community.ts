export interface ChatRoom {
  id: string
  name: string
  station: string
  location: { lat: number; lng: number }
  participants: number
}

export interface Message {
  id: string
  user: string
  content: string
  createdAt: string
}
