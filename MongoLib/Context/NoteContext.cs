using System;
using MongoDB.Driver;
using MongoLib.Model;
using Microsoft.Extensions.Configuration;
using MongoLib.Interface;

namespace MongoLib.Context
{
    public class NoteContext : INoteContext
    {
        private readonly IMongoDatabase _database = null;

        private readonly ConnectionSettings _settings;
    
        public NoteContext(IConfiguration root)
        {            
            _settings = root.GetSection("ConnectionSettings").Get<ConnectionSettings>();
            if(_settings != null)
            {
            var client = new MongoClient(_settings.ConnectionString);
            if (client != null)
                _database = client.GetDatabase(_settings.Database);
            }
        }

        public IMongoCollection<Note> Notes
        {
            get
            {
                return _database.GetCollection<Note>("Note");
            }
        }
    }
}
