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
    //[Authorize]
    public class LineController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();

        public LineController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Line> GetItems()
        {
            mutex.WaitOne();
            IEnumerable<Line> lines = unitOfWork.Lines.GetAll();
            mutex.ReleaseMutex();
            return lines;
        }

        // POST: api/Line
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {
            mutex.WaitOne();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Lines.Add(line);
            unitOfWork.Complete();

            mutex.ReleaseMutex();
            return CreatedAtRoute("DefaultApi", new { id = line.Id }, line);
        }

        // PUT: api/Line/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLine(int id, Line line)
        {
            mutex.WaitOne();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != line.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Lines.Update(line);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LineExists(id))
                {
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

        private bool LineExists(int id)
        {
            mutex.WaitOne();
            bool ret = unitOfWork.Lines.Get(id) != null;
            mutex.ReleaseMutex();
            return ret;
        }

        // DELETE: api/Line/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(int id)
        {
            mutex.WaitOne();
            Line line = unitOfWork.Lines.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            unitOfWork.Lines.Remove(line);
            unitOfWork.Complete();
            mutex.ReleaseMutex();
            return Ok(line);
        }

    }
}
