import Container from "../components/Container"
import DataTableComponent from "../components/DataTable"
import MainLayout from "../layouts/Default"

function ViewRes() {
  return (
    <MainLayout>
      <Container>
        <div className="mt-4">
          <DataTableComponent />
        </div>
      </Container>
    </MainLayout>
  )
}

export default ViewRes
