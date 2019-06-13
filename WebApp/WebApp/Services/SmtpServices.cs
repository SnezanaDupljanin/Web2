using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace WebApp.Services
{
    public class SmtpService : ISmtpService
    {
        public void SendMail(string subject, string body, string emailTo)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");
            mail.To.Add(emailTo);
            mail.Subject = subject;
            mail.Body = body;
            mail.From = new MailAddress("markovic.ivana996@gmail.com");
            SmtpServer.Port = 587;
            SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.Credentials = new System.Net.NetworkCredential("markovic.ivana996@gmail.com", "065257500");
            SmtpServer.EnableSsl = true;
            SmtpServer.Send(mail);

        }
    }
}