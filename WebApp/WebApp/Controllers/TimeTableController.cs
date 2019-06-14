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
    public class TimeTableController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();
        public TimeTableController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/TimeTable
        public IEnumerable<TimeTable> GetTimeTables()
        {
            return unitOfWork.TimeTables.GetAll();
        }
        //DELETE: api/TimeTable
        [ResponseType(typeof(void))]
        public IHttpActionResult DeleteLine(int id)
        {
            mutex.WaitOne();
            TimeTable t = unitOfWork.TimeTables.Get(id);
            if (t == null)
            {
                mutex.ReleaseMutex();
                return NotFound();
            }

            unitOfWork.TimeTables.Remove(t);
            unitOfWork.Complete();
            mutex.ReleaseMutex();
            return Ok(t);
        }
        //Put : api/TimeTable/id
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTimeTable(int id, TimeTable time)
        {
            mutex.WaitOne();
            if (!ModelState.IsValid)
            {
                mutex.ReleaseMutex();
                return BadRequest(ModelState);
            }

            if (id != time.Id)
            {
                mutex.ReleaseMutex();
                return BadRequest();
            }

            try
            {
                unitOfWork.TimeTables.Update(time);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeTableExist(id))
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
        private bool TimeTableExist(int id)
        {

            bool ret = unitOfWork.TimeTables.Get(id) != null;

            return ret;
        }
    }
}
