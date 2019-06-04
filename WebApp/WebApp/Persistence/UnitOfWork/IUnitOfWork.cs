using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IItemRepository Items { get; set; }
        ITicketRepository Tickets { get; set; }

        IStationRepository Stations { get; set; }

        IStationLineRepository StationLines { get; set; }
        ILineRepository Lines { get; set; }
        ITimeTableRepository TimeTables { get; set; }
        IPriceListRepository PriceLists { get; set; }
        IPriceListItemRepository PriceListItems { get; set; }
        ICoefficientRepository Coefficients { get; set; }
        int Complete();
    }
}
