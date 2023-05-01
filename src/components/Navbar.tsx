import { MegaMenu } from "primereact/megamenu"
import { MenuItem } from "primereact/menuitem"
import Container from "./Container"
import { Link } from "react-router-dom"

const Navbar = () => {
  const items: MenuItem[] = [
    {
      label: "Reservations",

      items: [
        [
          {
            items: [
              {
                label: "Add Reservation",
                url: "/addres",
              },
              {
                label: "View Reservation",
                url: "/viewres",
              },
            ],
          },
        ],
      ],
    },
    {
      label: "Sample Menu",
      items: [
        [
          {
            label: "Sample Menu 1",
            items: [{ label: "Sample Menu 1.1" }, { label: "Sample Menu 1.2" }],
          },
          {
            label: "Sample Menu 2",
            items: [{ label: "Sample Menu 2.1" }, { label: "Sample Menu 2.2" }],
          },
        ],
        [
          {
            label: "Sample Menu 3",
            items: [{ label: "Sample Menu 3.1" }, { label: "Sample Menu 3.2" }],
          },
          {
            label: "Sample Menu 4",
            items: [{ label: "Sample Menu 4.1" }, { label: "Sample Menu 4.2" }],
          },
        ],
        [
          {
            label: "Sample Menu 5",
            items: [{ label: "Sample Menu 5.1" }, { label: "Sample Menu 5.2" }],
          },
          {
            label: "Sample Menu 6",
            items: [{ label: "Sample Menu 6.1" }, { label: "Sample Menu 6.2" }],
          },
        ],
      ],
    },
    // {
    //   label: "Events",
    //   icon: "pi pi-fw pi-calendar",
    //   items: [
    //     [
    //       {
    //         label: "Event 1",
    //         items: [{ label: "Event 1.1" }, { label: "Event 1.2" }],
    //       },
    //       {
    //         label: "Event 2",
    //         items: [{ label: "Event 2.1" }, { label: "Event 2.2" }],
    //       },
    //     ],
    //     [
    //       {
    //         label: "Event 3",
    //         items: [{ label: "Event 3.1" }, { label: "Event 3.2" }],
    //       },
    //       {
    //         label: "Event 4",
    //         items: [{ label: "Event 4.1" }, { label: "Event 4.2" }],
    //       },
    //     ],
    //   ],
    // },
    // {
    //   label: "Settings",
    //   icon: "pi pi-fw pi-cog",
    //   items: [
    //     [
    //       {
    //         label: "Setting 1",
    //         items: [{ label: "Setting 1.1" }, { label: "Setting 1.2" }],
    //       },
    //       {
    //         label: "Setting 2",
    //         items: [{ label: "Setting 2.1" }, { label: "Setting 2.2" }],
    //       },
    //       {
    //         label: "Setting 3",
    //         items: [{ label: "Setting 3.1" }, { label: "Setting 3.2" }],
    //       },
    //     ],
    //     [
    //       {
    //         label: "Technology 4",
    //         items: [{ label: "Setting 4.1" }, { label: "Setting 4.2" }],
    //       },
    //     ],
    //   ],
    // },
  ]

  return (
    <>
      <section className="bg-white shadow-xl">
        <Container>
          <div className="flex items-center">
            <Link to="/">Home</Link>
            <MegaMenu
              model={items}
              className="bg-transparent border-none"
              breakpoint="960px"
            />
            <Link to="/search" className="flex items-center gap-2">
              <span className="pi pi-search"></span>
              Search
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}

export default Navbar
