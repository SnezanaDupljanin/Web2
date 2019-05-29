using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class Enums
    {
        public enum Roles : int
        {
            Admin,
            Controller,
            Passenger,
            UnregisteredUser
        }

        public enum UserTypes : int
        {
            Student,
            Pensioner,
            Regular
        }

        public enum TicketTypes : int
        {
            Temporal,
            Daily,
            Monthly,
            Yearly
        }
    }
}