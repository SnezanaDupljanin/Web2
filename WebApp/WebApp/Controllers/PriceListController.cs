﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class PriceListController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public PriceListController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/PriceLists
        public IEnumerable<PriceList> GetPriceLists()
        {
            return unitOfWork.PriceLists.GetAll();
        }



    }
}
