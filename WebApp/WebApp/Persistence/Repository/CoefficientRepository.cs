using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository
{
    public class CoefficientRepository : Repository<Coefficient, int>, ICoefficientRepository
    {
        public CoefficientRepository(DbContext context) : base(context)
        {
        }
    }
}