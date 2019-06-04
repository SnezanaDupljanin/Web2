using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository
{
    public class ItemRepository : Repository<Item, int>, IItemRepository
    {
        public ItemRepository(DbContext context) : base(context)
        {

        }
    }
}