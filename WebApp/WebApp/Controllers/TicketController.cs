using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    [Authorize]
    public class TicketController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();

        public TicketController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Ticket
        public IEnumerable<Ticket> GetTickets()
        {
            mutex.WaitOne();
            mutex.ReleaseMutex();
            return unitOfWork.Tickets.GetAll();
        }

        // POST: api/Ticket
        [Authorize(Roles = "Controller")]
        [ResponseType(typeof(Ticket))]
        public string PutTicket(int id, Ticket ticket)
        {
            mutex.WaitOne();
            Ticket ticket1 = unitOfWork.Tickets.Get(id);

            string result = String.Empty;
            DateTime dateTime = new DateTime();
            DateTime dateTimeNow = new DateTime();
            dateTimeNow = DateTime.Now;

            //One-hour
            if (ticket1.TicketType == 0)
            {
                dateTime = ticket1.DateOfPurchase.Value.AddHours(1);

                if (ticket1.DateOfPurchase < dateTimeNow && dateTimeNow < dateTime)
                {
                    ticket1.Valid = true;
                    result = "Ticket is valid.";
                }
                else
                {
                    result = "Ticket is not valid.";
                    ticket1.Valid = false;
                }
                //Day
            }
            else if (ticket1.TicketType == Enums.TicketTypes.Daily)
            {
                dateTime = DateTime.Now;

                if (ticket1.DateOfPurchase.Value.Day == dateTime.Day)
                {
                    result = "Valid ticket!";
                    ticket1.Valid = true;
                }
                else
                {
                    result = "Day has expired. Invalid";
                    ticket1.Valid = false;
                }
                //Mounth
            }
            else if (ticket1.TicketType == Enums.TicketTypes.Monthly)
            {
                dateTime = DateTime.Now;

                if (ticket.DateOfPurchase.Value.Month == dateTime.Month && ticket.DateOfPurchase.Value.Year == dateTime.Year)
                {
                    result = "Valid ticket";
                    ticket1.Valid = true;
                }
                else
                {
                    result = "Month has expired. Invalid";
                    ticket1.Valid = false;
                }

                //Year
            }
            else if (ticket1.TicketType == Enums.TicketTypes.Yearly)
            {
                dateTime = DateTime.Now;

                if (ticket.DateOfPurchase.Value.Year == dateTime.Year)
                {
                    result = "Valid ticket";
                    ticket1.Valid = true;
                }
                else
                {
                    result = "Year has expired. Invalid";
                    ticket1.Valid = false;
                }
            }

            unitOfWork.Tickets.Update(ticket1);
            unitOfWork.Complete();
            mutex.ReleaseMutex();
            return result;
        }

        // POST: api/Ticket
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult PostTicket(Ticket ticket)
        {
            mutex.WaitOne();
            ticket.DateOfPurchase = DateTime.Now;

            if (!ModelState.IsValid)
            {
                mutex.ReleaseMutex();
                return BadRequest(ModelState);
            }

            unitOfWork.Tickets.Add(ticket);
            unitOfWork.Complete();

            mutex.ReleaseMutex();
            return CreatedAtRoute("DefaultApi", new { id = ticket.Id }, ticket);
        }
    }
}
