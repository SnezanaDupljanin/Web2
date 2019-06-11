using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
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
        // PUT: api/AppUser/ ID
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser()
        {
            ApplicationUser appUser = new ApplicationUser();
            ApplicationDbContext contex = new ApplicationDbContext();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                if (HttpContext.Current.Request.Form.Count > 0)
                {
                    appUser = JsonConvert.DeserializeObject<ApplicationUser>(HttpContext.Current.Request.Form[0]);
                    ApplicationUser u = new ApplicationUser();
                    u = contex.Users.Where(x => x.Id == appUser.Id).FirstOrDefault();
                    u.Name = appUser.Name;
                    u.LastName = appUser.LastName;
                    u.DateOfBirth = appUser.DateOfBirth;
                    u.PasswordHash = appUser.PasswordHash;
                    u.Address = appUser.Address;
                    u.Type = appUser.Type;
                    u.ImageUrl = appUser.ImageUrl;
                    contex.SaveChanges();
                }
                else
                {
                    //ukoliko se form data nije popunilo
                }
            }
            catch (System.Exception e)
            {
            }

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
