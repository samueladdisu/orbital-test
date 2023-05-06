import { Button } from "primereact/button"
import Container from "../components/Container"
import DataTableComponent from "../components/DataTable"
import MainLayout from "../layouts/Default"
import { useEffect, useRef, useState } from "react"
import { ResService } from "../service/ResService"
import { Reservation } from "../interfaces/reservation"
import SearchForm from "../components/SearchForm"

function ViewRes() {
  const [finalRes, setFinalRes] = useState<Reservation[] | Reservation | any>(
    null
  )
  const searchRef = useRef<any>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = () => {
    ResService.getResMedium().then(data => setFinalRes(data))
  }

  const handleUpdateRes = (res: Reservation[] | null) => {
    setFinalRes(res)
  }

  return (
    <MainLayout>
      <Container>
        <div className="flex gap-2">
          <Button
            label="Search Form"
            className="mt-4"
            onClick={() => {
              searchRef.current?.toggleSearch()
            }}
          />
          <Button
            label="Refresh"
            className="mt-4"
            onClick={() => {
              fetchReservations()
            }}
            outlined
          />
        </div>
        <SearchForm ref={searchRef} updateRes={handleUpdateRes} />
        <div className="mt-4">
          {finalRes && <DataTableComponent resData={finalRes} />}
        </div>
      </Container>
    </MainLayout>
  )
}

export default ViewRes
