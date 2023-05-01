import Container from "../components/Container"
import MainLayout from "../layouts/Default"

function Home() {
  return (
    <MainLayout>
      <Container>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold">Home</h1>
        </div>
      </Container>
    </MainLayout>
  )
}

export default Home
