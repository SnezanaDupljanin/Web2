﻿using System;
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

        // POST: api/Line
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Lines.Add(line);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = line.Id }, line);
        }
    }
}
