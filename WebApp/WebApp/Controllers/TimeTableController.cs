using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class TimeTableController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public TimeTableController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/TimeTable
        public IEnumerable<TimeTable> GetTimeTables()
        {
            return unitOfWork.TimeTables.GetAll();
        }
    }
}
