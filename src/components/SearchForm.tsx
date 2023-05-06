import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { Dialog } from "primereact/dialog"
import MainLayout from "../layouts/Default"
import Container from "../components/Container"
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete"
import { Calendar, CalendarChangeEvent } from "primereact/calendar"
import { buttonClass } from "../config"
import { ResService } from "../service/ResService"
import { Reservation } from "../interfaces/reservation"
import DataTableComponent from "../components/DataTable"
import moment from "moment-timezone"
import { Button } from "primereact/button"

interface SearchFormProps {
  updateRes: (res: Reservation[] | null) => void
}

const SearchForm = forwardRef(({ updateRes }: SearchFormProps, ref) => {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [room, setRoom] = useState<number>(0)
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const [nameItems, setNameItems] = useState<string[]>([])
  const [emailItems, setEmailItems] = useState<string[]>([])
  const [roomItems, setRoomItems] = useState<number[]>([])

  const [finalRes, setFinalRes] = useState<Reservation[] | null>(null)

  const [filterdRes, setFilterdRes] = useState<Reservation[] | null>(null)

  const [dates, setDates] = useState<string | Date | Date[] | any>(null)

  const [disabledDates, setDisabledDates] = useState<Date[]>([])

  // const disabledDates = [
  //   new Date("5/4/2023"),
  //   new Date("5/5/2023"),
  //   new Date("5/6/2023"),
  // ]

  useImperativeHandle(ref, () => ({
    toggleSearch: () => setShowSearch(!showSearch),
  }))

  const clearForm = () => {
    setName("")
    setEmail("")
    setRoom(0)
    setDates(null)
    setNameItems([])
    setEmailItems([])
    setRoomItems([])
    setDisabledDates([])
    setFilterdRes(null)
    fetchReservations()
  }

  const fetchReservations = () => {
    const res = ResService.getResMedium().then((res: any) => {
      setFinalRes(res)
      setFilterdRes(res)
    })
  }

  const nameRef = useRef<HTMLInputElement>(null)

  const searchName = (event: AutoCompleteCompleteEvent) => {
    let resultName: Reservation[] | any = []

    console.log("name Ref", nameRef.current?.value)

    if (filterdRes !== null) {
      console.log("null")

      if (event.query === "" && name !== "") {
        resultName = filterdRes.filter(item =>
          item.name.toLowerCase().includes(name.toLowerCase())
        )
        console.log("name not null")
      }

      resultName = filterdRes.filter(item =>
        item.name.toLowerCase().includes(event.query.toLowerCase())
      )
    } else {
      console.log("null")
      resultName = ResService.getData().filter(item =>
        item.name.toLowerCase().includes(event.query.toLowerCase())
      )
    }

    // console.log(resultName)

    if (resultName.length === 0) {
      return
    }

    setFilterdRes(resultName)
    setNameItems(resultName.map((item: Reservation) => item.name))
  }

  const nameDropdown = () => {
    console.log(filterdRes)
  }
  const searchNameChange = (e: any) => {
    setName(e.value)
    let _name = e.value
    let resultName: Reservation[] | any = []

    console.log("name Ref", nameRef.current?.value)

    if (filterdRes !== null) {
      console.log("null")

      resultName = filterdRes.filter(item =>
        item.name.toLowerCase().includes(_name.toLowerCase())
      )
    } else {
      console.log("null")
      resultName = ResService.getData().filter(item =>
        item.name.toLowerCase().includes(_name.toLowerCase())
      )
    }

    // console.log(resultName)

    if (resultName.length === 0) {
      return
    }

    setFilterdRes(resultName)
    setNameItems(resultName.map((item: Reservation) => item.name))
  }

  const searchEmail = (event: AutoCompleteCompleteEvent) => {
    if (filterdRes !== null) {
      const resultEmail = filterdRes.filter(item =>
        item.email.toLowerCase().includes(event.query.toLowerCase())
      )

      if (resultEmail.length === 0) {
        return
      }

      setEmailItems(resultEmail.map(item => item.email))
      setFilterdRes(resultEmail)

      return
    }

    const resultEmail: Reservation[] | any = ResService.getData().filter(item =>
      item.email.toLowerCase().includes(event.query.toLowerCase())
    )

    if (resultEmail.length === 0) {
      return
    }

    setFilterdRes(resultEmail)
    setEmailItems(resultEmail.map((item: Reservation) => item.email))
  }

  const searchRoom = (event: AutoCompleteCompleteEvent) => {
    if (filterdRes !== null) {
      const resultRoom = filterdRes.filter(item =>
        item.roomNumber.toString().includes(event.query)
      )

      if (resultRoom.length === 0) {
        return
      }

      setFilterdRes(resultRoom)
      setRoomItems(resultRoom.map(item => item.roomNumber))
      return
    }

    const resultRoom: Reservation[] | any = ResService.getData().filter(item =>
      item.roomNumber.toString().includes(event.query)
    )

    if (resultRoom.length === 0) {
      return
    }

    setFilterdRes(resultRoom)
    setRoomItems(resultRoom.map((item: Reservation) => item.roomNumber))
  }

  const handleDate = (e: any) => {
    setDates(e.value)

    const formatted = e.value[0].toLocaleDateString()

    console.log("formatted", formatted)

    if (filterdRes !== null) {
      const result = filterdRes.filter(
        item =>
          moment(item.checkin).format("MM/DD/YYYY") === formatted ||
          moment(item.checkout).format("MM/DD/YYYY") === formatted
      )

      if (result.length === 0) {
        return
      }

      setFilterdRes(result)
      return
    }

    const result: any = ResService.getData().filter(
      item =>
        moment(item.checkin).format("MM/DD/YYYY") === formatted ||
        moment(item.checkout).format("MM/DD/YYYY") === formatted
    )

    if (result.length === 0) {
      return
    }

    setFilterdRes(result)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // setFinalRes(filterdRes)
    updateRes(filterdRes)
    setShowSearch(false)
  }
  return (
    <div>
      <Dialog
        header="Search Form"
        visible={showSearch}
        style={{ width: "30vw" }}
        onHide={() => setShowSearch(false)}
      >
        <p className="m-0">
          <form onSubmit={handleSubmit} className="flex flex-column gap-2">
            <div className="flex gap-2">
              <div className="flex flex-column gap-2">
                <label htmlFor="name">Name</label>
                <AutoComplete
                  value={name}
                  inputRef={nameRef}
                  suggestions={nameItems}
                  completeMethod={searchName}
                  onDropdownClick={nameDropdown}
                  onChange={e => searchNameChange(e)}
                  dropdown
                />
              </div>
              <div className="flex flex-column gap-2">
                <label htmlFor="name">email</label>
                <AutoComplete
                  value={email}
                  suggestions={emailItems}
                  completeMethod={searchEmail}
                  onChange={e => setEmail(e.value)}
                  dropdown
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
                  dropdown
                />
              </div>

              <div className="flex flex-column gap-2">
                <label>Select Date</label>
                <Calendar
                  value={dates}
                  onChange={handleDate}
                  selectionMode="range"
                  disabledDates={disabledDates}
                  dateFormat="mm/dd/yy"
                  readOnlyInput
                />
              </div>
            </div>
            <div className="flex">
              {/* <button className={buttonClass}>Search</button>
              <button className={buttonClass}>Clear</button> */}

              <Button label="Search" className="mr-2" />
              <Button label="Clear" onClick={clearForm} outlined />
            </div>
          </form>
        </p>
      </Dialog>
    </div>
  )
})

export default SearchForm
