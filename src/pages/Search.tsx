import React, { useState } from "react"
import MainLayout from "../layouts/Default"
import Container from "../components/Container"
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete"
import { Calendar, CalendarChangeEvent } from "primereact/calendar"
import { buttonClass } from "../config"
import { ResService } from "../service/ResService"

function Search() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [room, setRoom] = useState<number>(0)

  const [nameItems, setNameItems] = useState<string[]>([])
  const [emailItems, setEmailItems] = useState<string[]>([])
  const [roomItems, setRoomItems] = useState<number[]>([])

  const [dates, setDates] = useState<string | Date | Date[] | any>(null)

  const searchName = (event: AutoCompleteCompleteEvent) => {
    const resultName = ResService.getData().filter(item =>
      item.name.toLowerCase().includes(event.query.toLowerCase())
    )
    setNameItems(resultName.map(item => item.name))
  }

  const searchEmail = (event: AutoCompleteCompleteEvent) => {
    const resultEmail = ResService.getData().filter(item =>
      item.email.toLowerCase().includes(event.query.toLowerCase())
    )
    setEmailItems(resultEmail.map(item => item.email))
  }

  const searchRoom = (event: AutoCompleteCompleteEvent) => {
    const resultRoom = ResService.getData().filter(
      item => item.roomNumber === parseInt(event.query)
    )
    setRoomItems(resultRoom.map(item => item.roomNumber))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <MainLayout>
      <Container>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="mb-4 text-xl font-semibold">Search Form</h1>
          <form onSubmit={handleSubmit} className="flex flex-column gap-2">
            <div className="flex gap-2">
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Name</label>
                <AutoComplete
                  value={name}
                  suggestions={nameItems}
                  completeMethod={searchName}
                  onChange={e => setName(e.value)}
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">email</label>
                <AutoComplete
                  value={email}
                  suggestions={emailItems}
                  completeMethod={searchEmail}
                  onChange={e => setEmail(e.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Room</label>
                <AutoComplete
                  value={room}
                  suggestions={roomItems}
                  completeMethod={searchRoom}
                  onChange={e => setRoom(e.value)}
                />
              </div>

              <div className="flex flex-column gap-2">
                <label>Select Date</label>
                <Calendar
                  value={dates}
                  onChange={(e: CalendarChangeEvent) => setDates(e.value)}
                  selectionMode="range"
                  readOnlyInput
                />
              </div>
            </div>
            <div className="flex">
              <button className={buttonClass}>Search</button>
            </div>
          </form>
        </div>
      </Container>
    </MainLayout>
  )
}

export default Search
