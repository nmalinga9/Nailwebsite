import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admindashbackground.css';

const Admindashbackground = () => {
  const [bookings, setBookings] = useState([]); //Holds an array of booking data
  const [error, setError] = useState(null); //Stores any error messages 
  const [isLoading, setIsLoading] = useState(false); // data is currently being loaded or fetched
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedClient, setSelectedClient] = useState(null); //keeps track of each user on dashboard
  const navigate = useNavigate(); //allowing access to navigate within application

  useEffect(() => {
    fetchBookings(); //fetching user bookings
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    fetch('http://localhost/admin_dashboard.php') //the 'select' 'all users' table to collect all bookings to appear on dashboard
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data'); //notify if error in fetching data
        }
        return response.json();
      })
      .then(data => {
        setBookings(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setIsLoading(false);
      });
  };


  const sortBookingsByDateTime = (bookings) => {
    return bookings.sort((a, b) => {
      const dateA = new Date(`${a.SelectedDate} ${a.SelectedTime}`); //showcase selected date and time of user from 'users'table
      const dateB = new Date(`${b.SelectedDate} ${b.SelectedTime}`);
      return dateA - dateB;
    });
  };


  const handleAppointmentStatusToggle = (userId, newStatus) => {
    setIsLoading(true);
    fetch(`http://localhost/update_appointment_status.php?userId=${userId}&status=${newStatus}`, {
      method: 'PUT',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update appointment status');
        }
        return response.json();
      })
      .then(() => {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === userId ? { ...booking, appointment_status: newStatus } : booking
          )
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error updating appointment status:', error);
        setIsLoading(false);
      });
  };

  const toggleClientDetails = (bookingId) => {
    setSelectedClient(selectedClient === bookingId ? null : bookingId); 
    // id of client stored in database
  };

  const handleLogout = () => {
    navigate('/admin');
  };

  const filteredAndSortedBookings = bookings.filter(booking => {
    if (filter === 'all') {
      return true;
    } else {
      return booking.appointment_status === filter;
    }
  }).filter(booking => booking.appointment_status !== 'cancelled');

  const sortedBookings = sortBookingsByDateTime(filteredAndSortedBookings);

  const upcomingBookings = sortedBookings.filter(booking => new Date(`${booking.SelectedDate} ${booking.SelectedTime}`) >= new Date());
  const pastBookings = sortedBookings.filter(booking => new Date(`${booking.SelectedDate} ${booking.SelectedTime}`) < new Date());

  if (error) {
    return <div>Error fetching bookings: {error}</div>;
  }

  return (
    <div className="admindash-background">
      <nav>
        <div className='nav'>
          <div className="nav-logo">NNAILS</div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li className='nav-book'><Link to="/book">Book Here</Link></li>
          </ul>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="appointments-container">
          <div className="upcoming-appointments">
            <h2>Upcoming Appointments</h2>
            <div className="table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th onClick={() => setSortConfig({ key: 'SelectedDate', direction: sortConfig.key === 'SelectedDate' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Date {sortConfig.key === 'SelectedDate' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'SelectedTime', direction: sortConfig.key === 'SelectedTime' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Time {sortConfig.key === 'SelectedTime' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'Firstname', direction: sortConfig.key === 'Firstname' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      First Name {sortConfig.key === 'Firstname' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'Lastname', direction: sortConfig.key === 'Lastname' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Last Name {sortConfig.key === 'Lastname' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'SelectedService', direction: sortConfig.key === 'SelectedService' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Service {sortConfig.key === 'SelectedService' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}

                      {/* appointments in order in admin dashboard */}
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7}>Loading...</td>
                    </tr>
                  ) : upcomingBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No upcoming appointments.</td>
                    </tr>
                  ) : (
                    upcomingBookings.map(booking => (
                      <React.Fragment key={booking.id}>
                        <tr>
                          <td>{booking.SelectedDate}</td>
                          <td>{booking.SelectedTime}</td>
                          <td>{booking.Firstname}</td>
                          <td>{booking.Lastname}</td>
                          <td>{booking.SelectedService}</td>
                          <td>
                            {booking.appointment_status === 'completed' && (
                              <span className="status-completed">&#10003;</span>
                            )}
                            {booking.appointment_status === 'pending' && (
                              <span className="status-pending">&#9202;</span>

                              // marking as commpleted or pending functionality
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleAppointmentStatusToggle(
                                  booking.id,
                                  booking.appointment_status === 'completed' ? 'pending' : 'completed'
                                )
                              }
                              className="action-button"
                            >
                              {booking.appointment_status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                            </button>
                            <button
                              onClick={() => toggleClientDetails(booking.id)}
                              className="action-button"
                            >
                              {selectedClient === booking.id ? 'Hide Details' : 'Show Details'}
                              {/* buttons to hide and show contact details */}
                            </button>
                          </td>
                        </tr>
                        {selectedClient === booking.id && (
                          <tr>
                            <td colSpan="7">
                              <div className="client-details">
                                <strong>Email:</strong> {booking.Email}<br />
                                <strong>Phone:</strong> {booking.PhoneNumber}
                                {/* only show email and phone number from database */}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="past-appointments">
            <h2>Past Appointments</h2>
            <div className="table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th onClick={() => setSortConfig({ key: 'SelectedDate', direction: sortConfig.key === 'SelectedDate' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Date {sortConfig.key === 'SelectedDate' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'SelectedTime', direction: sortConfig.key === 'SelectedTime' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Time {sortConfig.key === 'SelectedTime' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'Firstname', direction: sortConfig.key === 'Firstname' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      First Name {sortConfig.key === 'Firstname' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'Lastname', direction: sortConfig.key === 'Lastname' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Last Name {sortConfig.key === 'Lastname' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th onClick={() => setSortConfig({ key: 'SelectedService', direction: sortConfig.key === 'SelectedService' ? (sortConfig.direction === 'ascending' ? 'descending' : 'ascending') : 'ascending' })}>
                      Service {sortConfig.key === 'SelectedService' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7}>Loading...</td>
                    </tr>
                  ) : pastBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7}>No past appointments.</td>
                    </tr>
                  ) : (
                    pastBookings.map(booking => (
                      <React.Fragment key={booking.id}>
                        <tr>
                          <td>{booking.SelectedDate}</td>
                          <td>{booking.SelectedTime}</td>
                          <td>{booking.Firstname}</td>
                          <td>{booking.Lastname}</td>
                          <td>{booking.SelectedService}</td>
                          <td>
                            {booking.appointment_status === 'completed' && (
                              <span className="status-completed">&#10003;</span>
                            )}
                            {booking.appointment_status === 'pending' && (
                              <span className="status-pending">&#9202;</span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                handleAppointmentStatusToggle(
                                  booking.id,
                                  booking.appointment_status === 'completed' ? 'pending' : 'completed'
                                )
                              }
                              className="action-button"
                            >
                              {booking.appointment_status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                            </button>
                            <button
                              onClick={() => toggleClientDetails(booking.id)}
                              className="action-button"
                            >
                              {selectedClient === booking.id ? 'Hide Details' : 'Show Details'}
                            </button>
                          </td>
                        </tr>
                        {selectedClient === booking.id && (
                          <tr>
                            <td colSpan="7">
                              <div className="client-details">
                                <strong>Email:</strong> {booking.Email}<br />
                                <strong>Phone:</strong> {booking.PhoneNumber}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admindashbackground;