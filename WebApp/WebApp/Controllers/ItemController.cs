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
    public class ItemController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public ItemController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/Item
        public IEnumerable<Item> GetItems()
        {
            return unitOfWork.Items.GetAll();
        }
    }
}
