using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class TicketController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public TicketController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Ticket
        public IEnumerable<Ticket> GetTickets()
        {
            return unitOfWork.Tickets.GetAll();
        }

        // POST: api/Ticket
        [ResponseType(typeof(Ticket))]
        public string PutTicket(int id, Ticket ticket)
        {

            Ticket ticket1 = unitOfWork.Tickets.Get(id);

            string result = String.Empty;
            DateTime dateTime = new DateTime();
            DateTime dateTimeNow = new DateTime();
            dateTimeNow = DateTime.Now;

            //One-hour
            if (ticket1.TicketType == 0)
            {
                dateTime = ticket1.DateOfPurchase.Value.AddHours(1);

                if (dateTimeNow < ticket1.DateOfPurchase && dateTimeNow > dateTime)
                {
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
                }
                else
                {
                    result = "Year has expired. Invalid";
                    ticket1.Valid = false;
                }
            }

            unitOfWork.Tickets.Update(ticket1);
            unitOfWork.Complete();

            return result;
        }

        // POST: api/Ticket
        [ResponseType(typeof(Ticket))]
        public IHttpActionResult PostTicket(Ticket ticket)
        {

            ticket.DateOfPurchase = DateTime.Now;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Tickets.Add(ticket);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = ticket.Id }, ticket);
        }
    }
}
