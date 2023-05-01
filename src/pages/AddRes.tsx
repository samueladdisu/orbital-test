import Container from "../components/Container"
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete"
import { Calendar, CalendarChangeEvent } from "primereact/calendar"
import MainLayout from "../layouts/Default"
import { useState } from "react"
import { buttonClass } from "../config"

function AddRes() {
  const [value, setValue] = useState<string>("")
  const [items, setItems] = useState<string[]>([])
  const [dates, setDates] = useState<string | Date | Date[] | any>(null)

  const search = (event: AutoCompleteCompleteEvent) => {
    setItems([...Array(10).keys()].map(item => event.query + "-" + item))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <MainLayout>
      <Container>
        <div className="flex flex-col items-center justify-center mt-5 bg-white">
          <h1 className="mb-4 text-xl font-semibold">Reserve Room</h1>
          <form onSubmit={handleSubmit} className="flex flex-column gap-2">
            <div className="flex gap-2">
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="p-inputtext p-component p-filled"
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">email</label>
                <input
                  type="text"
                  name="email"
                  id="name"
                  className="p-inputtext p-component p-filled"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Room</label>
                <AutoComplete
                  value={value}
                  suggestions={items}
                  completeMethod={search}
                  onChange={e => setValue(e.value)}
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
              <button className={buttonClass}>Submit</button>
            </div>
          </form>
        </div>
      </Container>
    </MainLayout>
  )
}

export default AddRes
