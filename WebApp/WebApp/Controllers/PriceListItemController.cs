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
    public class PriceListItemController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public PriceListItemController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/PriceListItem

        [HttpGet]
        public IEnumerable<PriceListItem> GetPriceListItem()
        {
            PriceList pl = unitOfWork.PriceLists.GetAll().Where(x => x.From <= DateTime.Now && x.To > DateTime.Now).FirstOrDefault();
            if (pl != null)
                return unitOfWork.PriceListItems.GetAll().Where(x => x.PriceList_Id == pl.Id);
            else
                return null;
        }
    }
}
