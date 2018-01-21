using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoLib.Interface;
using Microsoft.Extensions.Configuration;
using MongoLib.Model;

namespace MyApitoAws.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        private readonly INoteRepository _noteRepo;
        
        public ValuesController(INoteRepository noteRepo)
        {
            _noteRepo = noteRepo ?? throw new ArgumentNullException(nameof(noteRepo));
        }
        // GET api/values
        [HttpGet]
        public IEnumerable<Note> Get()
        {
            IEnumerable<Note> notes = new List<Note>();
            var items = _noteRepo.GetAllNotes();
            if (items != null)
                notes = items.Result;
            return notes;
        }

        [HttpPost]
        public IEnumerable<Note> GetAllNotes()
        {
            IEnumerable<Note> notes = new List<Note>();
            var items = _noteRepo.GetAllNotes();
            if (items != null)
                notes = items.Result;
            return notes;
        }

    [HttpGet("{setting}")]
    public string Get(string setting)
    {
        if (setting == "init")
        {
            _noteRepo.RemoveAllNotes();
            _noteRepo.AddNote(new Note() { Id = "1", Body = "Test note 1", 
                          CreatedOn = DateTime.Now, 
                          UpdatedOn = DateTime.Now, UserId = 1 });
            _noteRepo.AddNote(new Note() { Id = "2", Body = "Test note 2", 
                          CreatedOn = DateTime.Now, 
                          UpdatedOn = DateTime.Now, UserId = 1 });
            _noteRepo.AddNote(new Note() { Id = "3", Body = "Test note 3", 
                          CreatedOn = DateTime.Now, 
                          UpdatedOn = DateTime.Now, UserId = 2 });
            _noteRepo.AddNote(new Note() { Id = "4", Body = "Test note 4", 
                          CreatedOn = DateTime.Now, 
                          UpdatedOn = DateTime.Now, UserId = 2 });

            return "Done";
        }

        return "Unknown";
    }

        // GET api/values/5
        // [HttpGet("{id}")]
        // public string Get(int id)
        // {
        //     return "value";
        // }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
