using System;
using System.Collections.Generic;
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
    public class StationLineController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private Mutex mutex = new Mutex();

        public StationLineController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // POST: api/StationLine
        [Authorize(Roles = "Admin")]
        [ResponseType(typeof(StationLine))]
        public IHttpActionResult PostStationLine(StationLine stationLine)
        {

            mutex.WaitOne();

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.StationLines.Add(stationLine);
            unitOfWork.Complete();

            mutex.ReleaseMutex();

            return CreatedAtRoute("DefaultApi", new { id = stationLine.Id }, stationLine);
        }

        // GET: api/StationLine
        public IEnumerable<StationLine> GetStationLines()
        {

            mutex.WaitOne();
            IEnumerable<StationLine> stationLines = unitOfWork.StationLines.GetAll();
            mutex.ReleaseMutex();
            return stationLines;
        }
    }
}
