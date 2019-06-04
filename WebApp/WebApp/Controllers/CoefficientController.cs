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
    public class CoefficientController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public CoefficientController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/Coefficient
        public IEnumerable<Coefficient> GetItems()
        {
            return unitOfWork.Coefficients.GetAll();
        }
    }
}
