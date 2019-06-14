using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using WebApp.Models;
using WebApp.Persistence;

[assembly: OwinStartup(typeof(WebApp.Startup))]

namespace WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCors(CorsOptions.AllowAll);
            ConfigureAuth(app);
            app.MapSignalR();

            //    ApplicationDbContext db = new ApplicationDbContext();
            //    var userStore = new UserStore<ApplicationUser>(db);
            //    var userManager = new UserManager<ApplicationUser>(userStore);
            //    if (!db.Users.Any(u => u.UserName == "controller@yahoo.com"))
            //    {
            //        var user = new ApplicationUser() { Id = "controller", UserName = "controller@yahoo.com", Email = "controller@yahoo.com", PasswordHash = ApplicationUser.HashPassword("Controller123!") };
            //        userManager.Create(user);
            //        userManager.AddToRole(user.Id, "Controller");
            //    }
            //}

        }
    }
}

