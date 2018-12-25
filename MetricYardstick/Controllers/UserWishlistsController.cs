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
    public class UserWishlistsController : ApiController
    {
        private MetricYardstickDBEntities db = new MetricYardstickDBEntities();

        // GET: api/UserWishlists
        public IQueryable<UserWishlist> GetUserWishlists()
        {
            return db.UserWishlists;
        }

        // GET: api/UserWishlists/5
        [ResponseType(typeof(UserWishlist))]
        public async Task<IHttpActionResult> GetUserWishlist(int id)
        {
            UserWishlist userWishlist = await db.UserWishlists.FindAsync(id);
            if (userWishlist == null)
            {
                return NotFound();
            }

            return Ok(userWishlist);
        }

        // GET: api/UserWishlists/GetUsersSkills/5/custom
        /// <summary>
        /// Returns the Wishlist Skills associated with a User
        /// </summary>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [Route("api/UserWishlists/GetUsersWishlists/{id}/{type}")]
        public async Task<IHttpActionResult> GetUsersWishlists(string id, string type)
        {

            if (type == "master")

            {
                var query = from usr in db.UserWishlists
                            join ski in db.SkillsMasters on usr.SkillId equals ski.Id
                            where usr.UserId == id && usr.Type == "master"
                            select new
                            {
                                usr.Rating,
                                usr.Priority,
                                usr.Created,
                                usr.Modified,
                                ski.Name,
                                ski.Description,
                                ski.Id,
                                ski.Type

                            };

                return Ok(query);

            }
            else
            {
                var query = from usr in db.UserWishlists
                            join ski in db.SkillsCustoms on usr.SkillId equals ski.Id
                            where usr.UserId == id && usr.Type == "custom"
                            select new
                            {
                                usr.Rating,
                                usr.Priority,
                                usr.Created,
                                usr.Modified,
                                ski.Name,
                                ski.Description,
                                ski.Id,
                                ski.Type

                            };

                return Ok(query);

            }
        }

        // GET: api/UserWishlists/GetSelectedWishlist/5/custom
        /// <summary>
        /// Get detail for wishlist skill to add 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [Route("api/UserWishlists/GetSelectedWishlist/{id}/{type}")]
        public async Task<IHttpActionResult> GetSelectedWishlist(int id, string type)
        {
            if (type == "master")

            {
                var query = from ski in db.SkillsMasters
                            where ski.Id == id
                            select new
                            {
                                ski.Id,
                                ski.Name,
                                ski.Description,
                                ski.Type
                            };

                return Ok(query);

            }

            else
            {
                var query = from ski in db.SkillsCustoms
                            where ski.Id == id
                            select new
                            {
                                ski.Id,
                                ski.Name,
                                ski.Description,
                                ski.Type
                            };

                return Ok(query);
            }

        }

        // PUT: api/UserWishlists/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutUserWishlist(int id, UserWishlist userWishlist)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userWishlist.Id)
            {
                return BadRequest();
            }

            db.Entry(userWishlist).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserWishlistExists(id))
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

        // POST: api/UserWishlists
        /// <summary>
        /// Create a new User association with a Wishlist Skill
        /// </summary>
        /// <param name="userSkill"></param>
        /// <returns></returns>
        [ResponseType(typeof(UserWishlist))]
        public async Task<IHttpActionResult> PostUserWishlist(UserWishlist userWishlist)
        {

            var User = new AccountController().getUser();
            userWishlist.UserId = User.UserId;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool recordAlreadyExists = db.UserWishlists.Any(x => x.SkillId == userWishlist.SkillId && x.UserId == userWishlist.UserId);



            if (!recordAlreadyExists)
            {
                userWishlist.Created = DateTime.Now;
                db.UserWishlists.Add(userWishlist);
                await db.SaveChangesAsync();

                return CreatedAtRoute("DefaultApi", new { id = userWishlist.Id }, userWishlist);
            }
            else
            {
                return NotFound();
            }
        }

        // DELETE: api/UserWishlists/5
        [ResponseType(typeof(UserWishlist))]
        public async Task<IHttpActionResult> DeleteUserWishlist(int id)
        {
            UserWishlist userWishlist = await db.UserWishlists.FindAsync(id);
            if (userWishlist == null)
            {
                return NotFound();
            }

            db.UserWishlists.Remove(userWishlist);
            await db.SaveChangesAsync();

            return Ok(userWishlist);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserWishlistExists(int id)
        {
            return db.UserWishlists.Count(e => e.Id == id) > 0;
        }
    }
}