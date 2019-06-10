using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class StationController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public StationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Station> GetStations()
        {
            return unitOfWork.Stations.GetAll();
        }

        // POST: api/PriceLists
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Stations.Add(station);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = station.Id }, station);
        }
    }
}
