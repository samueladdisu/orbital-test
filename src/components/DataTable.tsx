import React, { useState, useEffect, useRef } from "react"
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

const options = {
  cMapUrl: "cmaps/",
  standardFontDataUrl: "standard_fonts/",
}

type PDFFile = string | File | null

interface Reservation {
  id: number
  name: string
  email: string
  roomNumber: number
  checkin: string
  checkout: string
  price: string
  status: string
  agent: string
}

export default function DataTableComponent() {
  const [res, setRes] = useState<Reservation[] | any>(null)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [filters, setFilters] = useState<any | null>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    agent: { value: null, matchMode: FilterMatchMode.IN },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("")

  const [visible, setVisible] = useState<boolean>(false)
  const [detail, setDetail] = useState<boolean>(false)
  const [agents] = useState(["agent1", "agent2", "agent3"])
  const dt = useRef<any>(null)
  const [file, setFile] = useState<PDFFile>("./res.pdf")
  const [numPages, setNumPages] = useState<number>()

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (files && files[0]) {
      setFile(files[0] || null)
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
    setNumPages(nextNumPages)
  }

  // const cols = [
  //   { field: "id", header: "Id" },
  //   { field: "name", header: "Name" },
  //   { field: "email", header: "Email" },
  //   { field: "roomNumber", header: "Room Number" },
  //   { field: "checkin", header: "Check In" },
  //   { field: "checkout", header: "Check Out" },
  //   { field: "price", header: "Price" },
  //   { field: "status", header: "Status" },
  //   { field: "agent", header: "Agent" },
  // ]
  // const exportColumns = cols.map(col => ({
  //   title: col.header,
  //   dataKey: col.field,
  // }))

  const clearFilter = () => {
    initFilters()
  }

  const agentFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <MultiSelect
        value={options.value}
        options={agents}
        itemTemplate={agentsItemTemplate}
        onChange={(e: MultiSelectChangeEvent) => {
          console.log(e.value)
          return options.filterCallback(e.value)
        }}
        placeholder="Any"
        className="p-column-filter"
      />
    )
  }

  const actionBodyTemplate = (rowData: Reservation) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-pencil"></i>
        <i className="pi pi-trash"></i>
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

  const agentsItemTemplate = (option: string) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option}</span>
      </div>
    )
  }

  useEffect(() => {
    ResService.getResMedium().then(data => setRes(data))
  }, [])

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
        style={{ width: "50vw" }}
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
        Agent: {selectedRes?.agent}
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
          field="agent"
          filterField="agent"
          showFilterMatchModes={false}
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "4rem" }}
          filter
          filterElement={agentFilterTemplate}
        />

        <Column header="Actions" body={actionBodyTemplate} />
      </DataTable>
    </div>
  )
}
