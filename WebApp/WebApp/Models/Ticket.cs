using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static WebApp.Models.Enums;

namespace WebApp.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public DateTime? DateOfPurchase { get; set; }
        public bool Valid { get; set; }
        public int User_Id { get; set; }
        public TicketTypes TicketType { get; set; }

    }
}