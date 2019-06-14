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
    public class StationController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();

        public StationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Station> GetStations()
        {
            mutex.WaitOne();
            IEnumerable<Station> stations = unitOfWork.Stations.GetAll();
            mutex.ReleaseMutex();
            return stations;
        }

        // POST: api/PriceLists
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {
            mutex.WaitOne();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Stations.Add(station);
            unitOfWork.Complete();
            mutex.ReleaseMutex();

            return CreatedAtRoute("DefaultApi", new { id = station.Id }, station);
        }

        // PUT: api/Station/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStation(int id, Station station)
        {
            mutex.WaitOne();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != station.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Stations.Update(station);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(id))
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

        private bool StationExists(int id)
        {
            mutex.WaitOne();

            bool ret = unitOfWork.Stations.Get(id) != null;

            mutex.ReleaseMutex();

            return ret;
        }

        // DELETE: api/Line/5
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteStation(int id)
        {
            mutex.WaitOne();

            Station station = unitOfWork.Stations.Get(id);
            if (station == null)
            {
                return NotFound();
            }

            unitOfWork.Stations.Remove(station);
            unitOfWork.Complete();

            unitOfWork.StationLines.RemoveRange(unitOfWork.StationLines.Find(x => x.Station_Id == id));
            unitOfWork.Complete();
            mutex.ReleaseMutex();

            return Ok(station);
        }

    }
}
