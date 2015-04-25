using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SPATest.Controllers
{
    public class ViewController : Controller
    {
        // GET: View
        public ActionResult Game()
        {
            return View();
        }
       
    }
}