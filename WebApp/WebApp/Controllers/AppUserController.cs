using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class AppUserController : ApiController
    {

        private readonly IUnitOfWork unitOfWork;

        public AppUserController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/AppUsers/5
        [Authorize]
        [ResponseType(typeof(ApplicationUser))]
        public IHttpActionResult GetAppUser(int id)
        {
            string idS = id.ToString();
            ApplicationDbContext contex = new ApplicationDbContext();

            if (idS == "0")
            {
                idS = contex.Users.FirstOrDefault(u => u.UserName == User.Identity.Name).Id;
            }

            ApplicationUser appUser = contex.Users.FirstOrDefault(u => u.Id == idS);
            if (appUser == null)
            {
                return NotFound();
            }

            return Ok(appUser);
        }
    }
}
