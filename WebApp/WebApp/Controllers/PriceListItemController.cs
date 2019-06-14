using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
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
    public class PriceListItemController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();

        public PriceListItemController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/PriceListItem

        [HttpGet]
        public IEnumerable<PriceListItem> GetPriceListItem()
        {
            mutex.WaitOne();
            PriceList pl = unitOfWork.PriceLists.GetAll().Where(x => x.From <= DateTime.Now && x.To > DateTime.Now).FirstOrDefault();
            if (pl != null)
            {
                mutex.ReleaseMutex();
                return unitOfWork.PriceListItems.GetAll().Where(x => x.PriceList_Id == pl.Id);
            }
            else
            {
                mutex.ReleaseMutex();
                return null;
            }
        }
        //Put : api/TimeTable/id
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPriceListItem(int id, PriceListItem pli)
        {
            mutex.WaitOne();
            if (!ModelState.IsValid)
            {
                mutex.ReleaseMutex();
                return BadRequest(ModelState);
            }

            if (id != pli.Id)
            {
                mutex.ReleaseMutex();
                return BadRequest();
            }

            try
            {
                unitOfWork.PriceListItems.Update(pli);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PriceListItemsExist(id))
                {
                    mutex.ReleaseMutex();
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            mutex.ReleaseMutex();
            return StatusCode(HttpStatusCode.NoContent);
        }
        private bool PriceListItemsExist(int id)
        {
            mutex.WaitOne();
            bool ret = unitOfWork.PriceListItems.Get(id) != null;
            mutex.ReleaseMutex();
            return ret;
        }
    }
}
