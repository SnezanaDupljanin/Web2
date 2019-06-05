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
    public class LineController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public LineController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Line> GetItems()
        {
            return unitOfWork.Lines.GetAll();
        }
    }
}
