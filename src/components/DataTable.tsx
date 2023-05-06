import React, { useState, useEffect, useRef, FormEvent } from "react"
import { FilterMatchMode } from "primereact/api"
import { DataTable } from "primereact/datatable"
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { ResService } from "../service/ResService"
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect"
import { Dialog } from "primereact/dialog"
import { Document, Page } from "react-pdf/dist/esm/entry.vite"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { Reservation, AgentOption } from "../interfaces/reservation"
import { Calendar, CalendarChangeEvent } from "primereact/calendar"
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { Toast } from "primereact/toast"

const options = {
  cMapUrl: "cmaps/",
  standardFontDataUrl: "standard_fonts/",
}

type PDFFile = string | File | null

export default function DataTableComponent({
  resData,
}: {
  resData: Reservation[]
}) {
  const [res, setRes] = useState<Reservation[] | any>(null)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [filters, setFilters] = useState<any | null>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    agent: { value: null, matchMode: FilterMatchMode.IN },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("")

  const [visible, setVisible] = useState<boolean>(false)
  const [detail, setDetail] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [agents] = useState<AgentOption[]>([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
  ])
  const dt = useRef<any>(null)
  const [file, setFile] = useState<PDFFile>("./res.pdf")
  const [numPages, setNumPages] = useState<number>()

  // Edit variables
  const [editName, setEditName] = useState<string>("")
  const [editEmail, setEditEmail] = useState<string>("")
  const [editRoom, setEditRoom] = useState<number>(0)
  const [editDates, setEditDates] = useState<Date | Date[] | any>(null)
  const [suggestRoomNumbers, setSuggestRoomNumbers] = useState<number[]>([])
  const deleteToast = useRef<Toast>(null)

  const searchRoomNumbers = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let results: number[] = []
      for (let i = 0; i < 10; i++) {
        results.push(+event.query + i)
      }

      setSuggestRoomNumbers(results)
    }, 250)
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (files && files[0]) {
      setFile(files[0] || null)
    }
  }

  const accept = () => {
    const updatedRes = res.filter(
      (res: Reservation) => res.id !== selectedRes?.id
    )
    setRes(updatedRes)

    deleteToast.current?.show({
      severity: "error",
      summary: "Confirmed",
      detail: "Deleted Successfully",
      life: 3000,
    })
  }

  const reject = () => {
    deleteToast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    })
  }

  const handleDelete = (rowData: Reservation) => {
    setSelectedRes(rowData)
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    })
    // const updatedRes = res.filter((res: Reservation) => res.id !== rowData.id)
    // setRes(updatedRes)
  }

  const handleEditSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const editedRes = {
      ...selectedRes,
      name: editName,
      email: editEmail,
      roomNumber: editRoom,
      checkin: editDates[0]?.toLocaleDateString(),
      checkout: editDates[1]?.toLocaleDateString(),
    }

    const updatedRes = res.map((res: Reservation) =>
      res.id === editedRes.id ? editedRes : res
    )

    setRes(updatedRes)

    setEdit(false)
    clearEditForm()
  }

  const handleEditButtonClick = (rowData: Reservation) => {
    setEditName(rowData.name)
    setEditEmail(rowData.email)
    setEditRoom(rowData.roomNumber)
    setEditDates([new Date(rowData.checkin), new Date(rowData.checkout)])
    setEdit(true)
  }

  const clearEditForm = () => {
    setEditName("")
    setEditEmail("")
    setEditRoom(0)
    setEditDates([])
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages)
  }

  const clearFilter = () => {
    initFilters()
  }

  const agentBodyTemplate = (rowData: Reservation) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={rowData.agent.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.agent.image}`}
          width="32"
        />
        <span>{rowData.agent.name}</span>
      </div>
    )
  }

  const agentFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelect
        value={options.value}
        options={agents}
        itemTemplate={agentsItemTemplate}
        onChange={(e: MultiSelectChangeEvent) =>
          options.filterCallback(e.value)
        }
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    )
  }

  const agentsItemTemplate = (option: AgentOption) => {
    return (
      <div className="flex align-items-center gap-2">
        <img
          alt={option.name}
          src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
          width="32"
        />
        <span>{option.name}</span>
      </div>
    )
  }

  const actionBodyTemplate = (rowData: Reservation) => {
    return (
      <div className="flex align-items-center gap-2">
        <i
          className="pi pi-pencil"
          onClick={() => handleEditButtonClick(rowData)}
        ></i>
        <i className="pi pi-trash" onClick={() => handleDelete(rowData)}></i>
        {rowData.status === "canceled" && <i className="pi pi-link"></i>}
      </div>
    )
  }

  const infoBodyTemplate = (rowData: Reservation) => {
    return (
      <div className="flex align-items-center gap-2">
        <i
          className="pi pi-info-circle"
          onClick={() => {
            setSelectedRes(rowData)
            setDetail(true)
          }}
        ></i>
        <i className="pi pi-file" onClick={() => setVisible(true)}></i>
      </div>
    )
  }

  useEffect(() => {
    if (resData) {
      setRes(resData)
    } else {
      ResService.getResMedium().then(data => setRes(data))
    }
  }, [resData])

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    let _filters = { ...filters }

    _filters["global"].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      agent: { value: null, matchMode: FilterMatchMode.IN },
    })
    setGlobalFilterValue("")
  }

  // const exportCSV = selectionOnly => {
  //   dt.current.exportCSV({ selectionOnly })
  // }

  // const exportPdf = () => {
  //   import("jspdf").then(jsPDF => {
  //     import("jspdf-autotable").then(() => {
  //       const doc = new jsPDF.default(0, 0)

  //       doc.autoTable(exportColumns, res)
  //       doc.save("res.pdf")
  //     })
  //   })
  // }

  const exportExcel = () => {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(res)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })

      saveAsExcelFile(excelBuffer, "res")
    })
  }

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then(module => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        let EXCEL_EXTENSION = ".xlsx"
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        })

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        )
      }
    })
  }

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
        />
        <div className="flex align-items-center justify-content-end gap-2">
          <Button
            type="button"
            icon="pi pi-file-excel"
            severity="success"
            rounded
            onClick={exportExcel}
            data-pr-tooltip="XLS"
          />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    )
  }

  const header = renderHeader()

  return (
    <div className="card">
      <Toast ref={deleteToast} />
      <ConfirmDialog />
      <Dialog
        header="Document"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </Dialog>

      <Dialog
        header="Details"
        visible={detail}
        style={{ width: "30vw" }}
        onHide={() => setDetail(false)}
      >
        Name: {selectedRes?.name}
        <br />
        Email: {selectedRes?.email}
        <br />
        Room Number: {selectedRes?.roomNumber}
        <br />
        Checkin: {selectedRes?.checkin}
        <br />
        Checkout: {selectedRes?.checkout}
        <br />
        Price: {selectedRes?.price}
        <br />
        Status: {selectedRes?.status}
        <br />
        Agent: {selectedRes?.agent.name}
        <br />
        <br />
        <Button
          type="button"
          icon="pi pi-times"
          label="Cancel"
          className="p-button-danger"
          onClick={() => setDetail(false)}
        />
      </Dialog>

      <Dialog
        header="Edit Reservation"
        visible={edit}
        style={{ width: "30vw" }}
        onHide={() => setEdit(false)}
      >
        <form onSubmit={handleEditSubmit} className="flex flex-column gap-2">
          <div className="flex gap-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="p-inputtext p-component p-filled"
              />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="name">email</label>
              <input
                type="text"
                name="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                id="name"
                className="p-inputtext p-component p-filled"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-column gap-2">
              <label htmlFor="name">Room</label>
              <AutoComplete
                value={editRoom}
                suggestions={suggestRoomNumbers}
                completeMethod={searchRoomNumbers}
                onChange={e => setEditRoom(e.value)}
              />
            </div>

            <div className="flex flex-column gap-2">
              <label>Select Date</label>
              <Calendar
                value={editDates}
                onChange={(e: any) => setEditDates(e.value)}
                selectionMode="range"
                readOnlyInput
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" label="Submit" />
            <Button label="Clear" outlined onClick={clearEditForm} />
          </div>
        </form>
      </Dialog>
      <DataTable
        value={res}
        paginator
        showGridlines
        rows={10}
        dataKey="id"
        filters={filters}
        globalFilterFields={[
          "name",
          "email",
          "roomNumber",
          "checkin",
          "checkout",
          "price",
          "status",
        ]}
        header={header}
        emptyMessage="No customers found."
      >
        <Column header="Info" body={infoBodyTemplate} />
        <Column field="id" header="Id" sortable style={{ minWidth: "2rem" }} />
        <Column
          field="name"
          header="Name"
          sortable
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Email"
          field="email"
          sortable
          filterField="email"
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Room Number"
          field="roomNumber"
          sortable
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Check In"
          field="checkin"
          sortable
          dataType="date"
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Check Out"
          field="checkout"
          sortable
          dataType="date"
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Price"
          sortable
          field="price"
          style={{ minWidth: "4rem" }}
        />
        <Column
          field="status"
          sortable
          header="Status"
          style={{ minWidth: "4rem" }}
        />
        <Column
          header="Agent"
          filterField="agent"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "14rem" }}
          body={agentBodyTemplate}
          filter
          filterElement={agentFilterTemplate}
        />

        <Column header="Actions" body={actionBodyTemplate} />
      </DataTable>
    </div>
  )
}
