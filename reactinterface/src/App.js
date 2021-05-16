import { BiCalendar } from "react-icons/bi"
import Search from "./component/Search"
import AddAppointment from "./component/AddAppointment"
import AppointmentInfo from "./component/AppointmentInfo"
import { useEffect, useState, useCallback } from "react"

function App() {

  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery]=useState("");
  let [sortBy, setSortBy]=useState("petName");
  let [orderBy, setOrderBy]=useState("asc");

  const filteredAppointments = appointmentList.filter(
    item => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase()) 
      )
    }
  ).sort((a, b) => {
    let order = (orderBy==='asc')? 1 : -1;
    return (
      a[sortBy].toLowerCase()< b[sortBy].toLowerCase()
      ? -1*order : 1*order
    )
  });

  // eslint-disable-next-line
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => { setAppointmentList(data) }, []);
  })
  useEffect(()=>{
    fetchData()
  },[fetchData])
  return (
    <div className="App container mx-auto mt-3 font-thin">
      <header>
        <h1 className="test-5xl mb-3">
          <BiCalendar className="inline-block text-red-500 align-middle" />Your Appointments</h1>
      </header>
      <AddAppointment 
      onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
      lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query={query}
      onQueryChange={myQuery=>setQuery(myQuery)}
      orderBy={orderBy}
      onOrderByChange={myOrder=> setOrderBy(myOrder)}
      sortBy={sortBy}
      onSortByChange={mySort=> setSortBy(mySort)}
      />
      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map(appointment => (
          <AppointmentInfo key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={
              appointmentID =>
              setAppointmentList(appointmentList.filter(appointment => 
                appointment.id !== appointmentID))
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
