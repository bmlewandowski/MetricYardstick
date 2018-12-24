using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using MetricYardstick;

namespace MetricYardstick.Controllers
{
    [Authorize]
    public class UserEducationsController : ApiController
    {
        private MetricYardstickDBEntities db = new MetricYardstickDBEntities();

        // GET: api/UserEducations
        public IQueryable<UserEducation> GetUserEducations()
        {
            return db.UserEducations;
        }

        // GET: api/UserEducations/5
        [ResponseType(typeof(UserEducation))]
        public async Task<IHttpActionResult> GetUserEducation(int id)
        {
            UserEducation userEducation = await db.UserEducations.FindAsync(id);
            if (userEducation == null)
            {
                return NotFound();
            }

            return Ok(userEducation);
        }

        // GET: api/UserEducations/5
        [Route("api/GetEducationByUser/{id}")]
        [ResponseType(typeof(UserEducation))]
        public IQueryable<UserEducation> GetEducationByUser(string id)
        {
            //UserEducation userEducation = await db.UserEducations.FindAsync(id);
            return db.UserEducations.Where(x => x.UserId == id);
        }

        // PUT: api/UserEducations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUserEducation(int id, UserEducation userEducation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userEducation.Id)
            {
                return BadRequest();
            }

            db.Entry(userEducation).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserEducationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/UserEducations
        [ResponseType(typeof(UserEducation))]
        public async Task<IHttpActionResult> PostUserEducation(UserEducation userEducation)
        {
            //Get Current User from Claim Token
            var User = new AccountController().getUser();

            //Get Current User and apply to the Model
            userEducation.UserId = User.UserId;

            //Get Current Org and apply to the Model
            userEducation.OrgId = User.OrgId;

            //Set Created Date to Current
            userEducation.Created = DateTime.Now;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserEducations.Add(userEducation);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = userEducation.Id }, userEducation);
        }

        // DELETE: api/UserEducations/5
        [ResponseType(typeof(UserEducation))]
        public async Task<IHttpActionResult> DeleteUserEducation(int id)
        {
            UserEducation userEducation = await db.UserEducations.FindAsync(id);
            if (userEducation == null)
            {
                return NotFound();
            }

            db.UserEducations.Remove(userEducation);
            await db.SaveChangesAsync();

            return Ok(userEducation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserEducationExists(int id)
        {
            return db.UserEducations.Count(e => e.Id == id) > 0;
        }
    }
}